import React = require("react");
import {connect} from "react-redux";
import {sample, random, without, map, find, isEqual, delay,
        include, values, xor, intersection} from "lodash";
import {Button, Col, Badge} from "react-bootstrap";
import classNames = require("classnames");

import {IAppState, IInterval, playInterval, INTERVALS} from "../data/actions";
import {IMidiEv} from "../dragon/backends/spec";

const TestCSS = require("./test.css");

const NOTE_NAMES: {[key: number]: string} = {
    0: "C",
    1: "C♯",
    2: "D",
    3: "E♭",
    4: "E",
    5: "F",
    6:" F♯",
    7: "G",
    8: "A♭",
    9: "A",
    10: "B♭",
    11: "B"
};

export interface IProps {
    playingInterval: boolean;
    params: {
        /**
         * Comma seperated short names
         */
        intervals: string;
    }; // Injected by router

    inputEvents: {[key: number]: IMidiEv};

    dispatch: (action: any) => void; // Injected by @connect.
}

export interface IState {
    currentInterval?: IInterval;

    /**
     * The first note of the interval to be played.
     * This isn't displayed to the user, nor does the user need to guess it, we just
     * pick a new root every time to make the test more interesting.
     */
    currentRoot?: number;
    points?: number;
    currentGuesses?: IInterval[];
    failed?: boolean;
    correct?: boolean;
    gaveUp?: boolean;
    playingCurrent?: boolean;
    ptsExplanation?: string;
    /**
     * Can be "wrong" if the wrong root has been played
     */
    expectingRoot?: boolean | string;
}

@connect((state: IAppState) => ({
    count: state.count, // See count in props
    playingInterval: state.playingInterval
}))
export default class TestByEar extends React.Component<IProps, IState> {
    state: IState = {
        currentInterval: null,
        currentRoot: NaN,
        points: 0,
        currentGuesses: [],
        failed: false,
        correct: false,
        gaveUp: false,
        playingCurrent: false,
        expectingRoot: false
    };
   
    _playCurrentInterval = () => {
        const {dispatch} = this.props;
        const {currentInterval, currentRoot} = this.state;
        dispatch(playInterval(currentInterval, currentRoot));
        this.setState({
            playingCurrent: true
        });
        delay(() => {
            this.setState({
                playingCurrent: false
            });
        }, 1400);
    }

    _pickInterval = (intervals: IInterval[]) => {
        const {currentInterval} = this.state;
        this.setState({
            currentInterval: sample(without(intervals, currentInterval)),
            currentRoot: random(48, 68, false /* not floating-point */),
            currentGuesses: [],
            correct: false,
            gaveUp: false,
            expectingRoot: true
        });
    }
    
    _extractIntervals(props: IProps): IInterval[] {
        const {intervals} = props.params;
        return map(intervals.split(","), interval => find(INTERVALS, {
            shortName: interval
        }));
    }

    _giveUp = () => {
        const {points} = this.state;
        const intervals = this._extractIntervals(this.props);
        this.setState({
            correct: false,
            gaveUp: true,
        });
        this._playCurrentInterval();
        this.setState({
            points: points - 5,
            ptsExplanation: "-5 pts for giving up"
        });
        delay(() => {
            this._pickInterval(intervals);
        }, 1400);
    }

    render() {
        const {dispatch, playingInterval, inputEvents} = this.props;
        const {currentInterval, points, currentGuesses, failed,
            currentRoot, correct, playingCurrent, gaveUp, ptsExplanation} = this.state;
        const intervals = this._extractIntervals(this.props);

        const root = NOTE_NAMES[currentRoot % 12];

        return <div className={classNames(TestCSS.page, {
                    [TestCSS.failed]: failed,
                    [TestCSS.gaveUp]: gaveUp,
                    [TestCSS.gotIt]: correct
                })}>
            <strong>Current score:</strong> {"\u00a0"}
                <Badge className={classNames({
                        "alert-danger": gaveUp,
                        "alert-success": correct
                    })}>
                    {points}
                </Badge>
                <span className={TestCSS.explanation}>
                    {ptsExplanation}
                </span>
            <h3>
                Play the interval back, starting with {`\"${root}\"`}.
                <div className={TestCSS.Actions}>
                    <Button
                            onClick={this._playCurrentInterval}
                            disabled={playingInterval}
                            bsStyle="link"
                            className={classNames({
                                [TestCSS.playingCurrent]: playingCurrent
                            })} >
                        <span className="fa-play fa" />{"\u00a0"}
                        Play again
                    </Button>{"\u00a0"}
                    <Button onClick={this._giveUp} disabled={playingInterval} bsStyle="link">
                        <span className="fa-forward fa" />{"\u00a0"}
                        Give up (-5 pts)
                    </Button>
                </div>
            </h3>
            <div>
                {this.state.expectingRoot === "wrong" &&
                    <div className={TestCSS.rootHint}>First play the root!! </div>}
                {!this.state.expectingRoot &&
                    <div className={TestCSS.nextNoteHint}>Now play the second note!! </div>}
                {!Object.keys(inputEvents).length ?
                    <span>You are not playing any notes.</span> :
                    <span>You are playing{" "}
                        {map(values(inputEvents), (event: IMidiEv) =>
                            NOTE_NAMES[event.note % 12]).join(", ")}.
                    </span>}
            </div>
            <div style={{width: "100%", display: "inline-block"}}>
            </div>
        </div>;
    }

    componentWillMount() {
        this._pickInterval(this._extractIntervals(this.props));
    }

    componentDidMount() {
        delay(() => {
            // TODO: Actually wait until samples have loaded!
            this._playCurrentInterval();
        }, 1000);
    }

    componentWillReceiveProps(nextProps: IProps) {
        let {dispatch} = nextProps;
        let {currentInterval, currentRoot, currentGuesses, points} = this.state;
        const intervals = this._extractIntervals(nextProps);

        if (!isEqual(this._extractIntervals(this.props), this._extractIntervals(nextProps))) {
            this._pickInterval(this._extractIntervals(nextProps));
        }
        
        if (!isEqual(this.props.inputEvents, nextProps.inputEvents)) {
            const oldNotes = map(values(this.props.inputEvents), (ev: IMidiEv) => ev.note);
            const nextNotes = map(values(nextProps.inputEvents), (ev: IMidiEv) => ev.note);

            const newNotes: number[] = intersection(nextNotes,
                xor(nextNotes, oldNotes));

            if (this.state.expectingRoot) {
                if (include(map(newNotes, note => note % 12), this.state.currentRoot % 12)) {
                    this.setState({
                        expectingRoot: false
                    });
                } else {
                    this.setState({
                        expectingRoot: "wrong"
                    });
                }
            } else {
                if (include(map(newNotes, note => note % 12),
                        (this.state.currentRoot + this.state.currentInterval.semitones) % 12)) {
                            
                    if (currentGuesses.length) {
                        this.setState({
                            points: points + 3,
                            ptsExplanation: "+3 pts for getting it right after persevering"
                        });
                    } else {
                        this.setState({
                            points: points + 10,
                            ptsExplanation: "+10 pts for getting it right on your first try"
                        });
                    }
                    this.setState({
                        correct: true
                    });
                    delay(() => {
                        this._pickInterval(intervals);
                    }, 1000);
                } else {
                    console.log("Test");
                    this.setState({
                        currentGuesses: currentGuesses.concat(null),
                        failed: true,
                        ptsExplanation: ""
                    });
                    delay(() => {
                        this.setState({
                            failed: false
                        });
                        this._playCurrentInterval();
                    }, 1000);
                }
            }
        }
    }

    componentDidUpdate(oldProps: IProps, oldState: IState) {
        if (this.state.currentInterval !== oldState.currentInterval) {
            this._playCurrentInterval();
        }
    }
}
