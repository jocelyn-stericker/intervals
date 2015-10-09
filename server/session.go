package main

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/garyburd/redigo/redis"
)

const (
	SESSION_EXPIRY = 30 * 24 * time.Hour
	SESSION_ID_KEY = "_ID"
	CSRF_TOKEN_KEY = "_CSRF"
	CSRF_COOKIE    = "INTERVALS_CSRF_TOKEN"
	SESSION_COOKIE = "INTERVALS_SESSION"
	CSRF_HEADER    = "X-CSRF-Token"
)

var (
	keyValueParser = regexp.MustCompile("\x00([^:]*):([^\x00]*)\x00")
	secretKey      = []byte("") // SET ME
)

func sign(message string) string {
	if len(secretKey) == 0 {
		return ""
	}
	mac := hmac.New(sha1.New, secretKey)
	io.WriteString(mac, message)
	return hex.EncodeToString(mac.Sum(nil))
}

func verify(message, sig string) bool {
	return hmac.Equal([]byte(sig), []byte(sign(message)))
}

type Session map[string]string

func (s Session) Id() string {
	if sessionIdStr, ok := s[SESSION_ID_KEY]; ok {
		return sessionIdStr
	}

	buffer := make([]byte, 32)
	if _, err := rand.Read(buffer); err != nil {
		panic(err)
	}

	s[SESSION_ID_KEY] = hex.EncodeToString(buffer)
	return s[SESSION_ID_KEY]
}

func SaveSession(w http.ResponseWriter, s Session) {
	if len(s) == 0 {
		return
	}

	var sessionValue string
	sessionToken := s.Id()
	if _, ok := s[CSRF_TOKEN_KEY]; !ok {
		buf := make([]byte, 32)
		_, err := rand.Read(buf)
		if err == nil {
			s[CSRF_TOKEN_KEY] = hex.EncodeToString(buf)
		} else {
			fmt.Println(err)
		}
	}

	for key, value := range s {
		if key == SESSION_ID_KEY {
			continue
		}
		if strings.ContainsAny(key, ":\x00") {
			panic("Session keys may not have colons or null bytes")
		}
		if strings.Contains(value, "\x00") {
			panic("Session values may not have null bytes")
		}
		sessionValue += "\x00" + key + ":" + value + "\x00"
	}

	redisConn := Redis.Get()
	defer redisConn.Close()

	params := []interface{}{"session:" + sessionToken, sessionValue}
	params = append(params, "EX", int(SESSION_EXPIRY/time.Second))
	_, err := redisConn.Do("SET", params...)
	if err != nil {
		fmt.Println(err)
		return
	}

	cookie := &http.Cookie{
		Name:     SESSION_COOKIE,
		Value:    sign(sessionToken) + "-" + sessionToken,
		Path:     "/",
		HttpOnly: true,
	}
	cookie.Expires = time.Now().Add(SESSION_EXPIRY).UTC()

	http.SetCookie(w, cookie)

	http.SetCookie(w, &http.Cookie{
		Name:    CSRF_COOKIE,
		Value:   s[CSRF_TOKEN_KEY],
		Path:    "/",
		Expires: cookie.Expires,
	})
}

func LoadSession(req *http.Request) Session {
	session := make(Session)

	cookie, err := req.Cookie(SESSION_COOKIE)
	if err != nil {
		return session
	}

	// Separate the token from the signature.
	hyphen := strings.Index(cookie.Value, "-")
	if hyphen == -1 || hyphen >= len(cookie.Value)-1 {
		return session
	}
	sig, token := cookie.Value[:hyphen], cookie.Value[hyphen+1:]

	// Verify the signature.
	if !verify(token, sig) {
		fmt.Println("Session cookie signature failed")
		return session
	}

	redisConn := Redis.Get()
	defer redisConn.Close()

	data, err := redis.String(redisConn.Do("GET", "session:"+token))
	if err != nil {
		if err != redis.ErrNil {
			fmt.Println(err)
		}
		return session
	}

	val, _ := url.QueryUnescape(data)
	if matches := keyValueParser.FindAllStringSubmatch(val, -1); matches != nil {
		for _, match := range matches {
			session[match[1]] = match[2]
		}
	}
	session[SESSION_ID_KEY] = token

	if csrfToken, ok := session[CSRF_TOKEN_KEY]; ok {
		csrfCookie, err := req.Cookie(CSRF_COOKIE)
		if err != nil || csrfCookie.Value != csrfToken {
			return make(Session)
		}
		if req.Method != "GET" && req.Method != "HEAD" {
			csrfHeader := req.Header.Get(CSRF_HEADER)
			if csrfHeader != csrfToken {
				return make(Session)
			}
		}
	}

	return session
}

func RevokeSession(s *Session) error {
	token, ok := (*s)[SESSION_ID_KEY]
	*s = make(Session)
	if !ok {
		return nil
	}
	fmt.Println("Revoking session:", token)

	redisConn := Redis.Get()
	defer redisConn.Close()

	_, err := redisConn.Do("DEL", "session:"+token)
	return err
}
