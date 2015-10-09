package main

import (
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/garyburd/redigo/redis"
	"github.com/gorilla/mux"
)

var Redis *redis.Pool

func InitRedis() {
	Redis = &redis.Pool{
		MaxIdle: 32,
		Dial: func() (conn redis.Conn, err error) {
			conn, err = redis.Dial("tcp", ":6379")
			if err != nil {
				return nil, err
			}
			return conn, nil
		},
		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
}

func DefaultHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	f, err := http.Dir("../dist").Open(filepath.Clean(path))
	if err != nil {
		// Default to index.html if the file doesn't exist
		f, _ = os.Open("../static/index.html")
	}
	s, err := f.Stat()
	if err != nil || s.IsDir() {
		// Default to index.html if the file is a directory
		f, _ = os.Open("../static/index.html")
		s, _ = f.Stat()
	}
	http.ServeContent(w, r, s.Name(), s.ModTime(), f)
}

func ApiStorageGetHandler(w http.ResponseWriter, r *http.Request) {
	session := LoadSession(r)
	w.Write([]byte(session["user_data"]))
}

func ApiStoragePostHandler(w http.ResponseWriter, r *http.Request) {
	session := LoadSession(r)
	data, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return
	}
	session["user_data"] = string(data)
	SaveSession(w, session)

	w.Write([]byte(session["user_data"]))
}

func main() {
	InitRedis()

	r := mux.NewRouter()
	r.Path("/api/storage").Methods("GET").HandlerFunc(ApiStorageGetHandler)
	r.Path("/api/storage").Methods("POST").HandlerFunc(ApiStoragePostHandler)
	r.PathPrefix("/").HandlerFunc(DefaultHandler)
	http.ListenAndServe(":8000", r)
}
