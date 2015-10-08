import React = require("react");
import {connect} from "react-redux";
import {sample, random, without, map, find, isEqual, delay, include} from "lodash";
import {Button, Col, Badge} from "react-bootstrap";
import classNames = require("classnames");

import {IAppState, IInterval, playIntervals, INTERVALS} from "../data/actions";

const TestCSS = require("./test.css");
const MAX_INTERVAL_DURATION = 2200;

export interface IProps {
    playingIntervals: boolean;
    params: {
        /**
         * Comma seperated short names
         */
        intervals: string;
    }; // Injected by router
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
}

@connect((state: IAppState) => ({
    count: state.count, // See count in props
    playingIntervals: state.playingIntervals
}))
export default class Test extends React.Component<IProps, IState> {
    state: IState = {
        currentInterval: null,
        currentRoot: NaN,
        points: 0,
        currentGuesses: [],
        failed: false,
        correct: false,
        gaveUp: false,
        playingCurrent: false
    };
   
    _playCurrentInterval = (wrongGuess: IInterval) => {
        const {dispatch} = this.props;
        const {currentInterval, currentRoot} = this.state;
        var intervalsToPlay: IInterval[] = [];
        if(wrongGuess){
            intervalsToPlay.concat(wrongGuess);
        }
        intervalsToPlay.concat(currentInterval);
        dispatch(playIntervals(intervalsToPlay, currentRoot));
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
            gaveUp: false
        });
    }
    
    _extractIntervals(props: IProps): IInterval[] {
        const {intervals} = props.params;
        return map(intervals.split(","), interval => find(INTERVALS, {
            shortName: interval
        }));
    }
    
    _guess = (interval: IInterval) => {
        const {currentInterval, currentGuesses, currentRoot, points} = this.state;
        const {dispatch} = this.props;
        const intervals = this._extractIntervals(this.props);
        if (isEqual(interval, currentInterval)) {
            this.setState({
                correct: true
            });
            this._playCurrentInterval();
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
            delay(() => {
                this._pickInterval(intervals);
            }, MAX_INTERVAL_DURATION);
        } else {
            this.setState({
                currentGuesses: currentGuesses.concat(interval),
                failed: true,
                ptsExplanation: ""
            });
            dispatch(playIntervals([interval], currentRoot));
            delay(() => {
                this.setState({
                    failed: false
                });
                this._playCurrentInterval();
            }, MAX_INTERVAL_DURATION);
        }
    }
    
    _giveUp = () => {
        const {points} = this.state;
        const intervals = this._extractIntervals(this.props);
        this.setState({
            correct: false,
            gaveUp: true
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
        const {dispatch, playingIntervals} = this.props;
        const {currentInterval, points, currentGuesses, failed,
            correct, playingCurrent, gaveUp, ptsExplanation} = this.state;
        const intervals = this._extractIntervals(this.props);

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
                What interval was that?
                <div className={TestCSS.Actions}>
                    <Button
                            onClick={this._playCurrentInterval}
                            disabled={playingIntervals}
                            bsStyle="link"
                            className={classNames({
                                [TestCSS.playingCurrent]: playingCurrent
                            })} >
                        <span className="fa-play fa" />{"\u00a0"}
                        Play again
                    </Button>{"\u00a0"}
                    <Button onClick={this._giveUp} disabled={playingIntervals} bsStyle="link">
                        <span className="fa-forward fa" />{"\u00a0"}
                        Give up (-5 pts)
                    </Button>
                </div>
            </h3>
            <div className={TestCSS.OptionGroup}>
                {map(intervals, interval => <Col xs={6} sm={3} md={2} lg={2} className={TestCSS.Option}>
                    <Button key={interval.shortName}
                            style={{width: "100%"}}
                            onClick={() => this._guess(interval)}
                            disabled={playingIntervals || include(currentGuesses, interval)}
                            className={classNames(TestCSS.OptionButton, {
                                [TestCSS.badGuess]: include(currentGuesses, interval),
                                [TestCSS.correct]: interval === currentInterval,
                                [TestCSS.latestGuess]: interval === currentGuesses[currentGuesses.length - 1]
                            })}>
                        {interval.name}
                    </Button>
                </Col>)}
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
        if (!isEqual(this._extractIntervals(this.props), this._extractIntervals(nextProps))) {
            this._pickInterval(this._extractIntervals(nextProps));
        }
    }
    
    componentDidUpdate(oldProps: IProps, oldState: IState) {
        if (this.state.currentInterval !== oldState.currentInterval) {
            this._playCurrentInterval();
        }
    }
}
