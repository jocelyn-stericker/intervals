import React = require("react");
import {connect} from "react-redux";
import {sample, random, without, map, find, isEqual, delay} from "lodash";
import {Button, Col} from "react-bootstrap";

import {IAppState, IInterval, playInterval, INTERVALS} from "../data/actions";

const TestCSS = require("./test.css");

export interface IProps {
    playingInterval: boolean;
    params: {
        /**
         * Comma seperated short names
         */
        intervals: string;
    }; // Injected by router
    dispatch: (action: any) => void; // Injected by @connect.
}

export interface IState {
    currentInterval: IInterval;

    /**
     * The first note of the interval to be played.
     * This isn't displayed to the user, nor does the user need to guess it, we just
     * pick a new root every time to make the test more interesting.
     */
    currentRoot: number;
}

@connect((state: IAppState) => ({
    count: state.count, // See count in props
    playingInterval: state.playingInterval
}))
export default class Test extends React.Component<IProps, IState> {
    state: IState = {
        currentInterval: null,
        currentRoot: NaN
    };
   
    _playCurrentInterval = () => {
        const {dispatch} = this.props;
        const {currentInterval, currentRoot} = this.state;
        dispatch(playInterval(currentInterval, currentRoot));
    }

    _pickInterval = (intervals: IInterval[]) => {
        const {currentInterval} = this.state;
        this.setState({
            currentInterval: sample(without(intervals, currentInterval)),
            currentRoot: random(60, 80, false /* not floating-point */)
        });
    }
    
    _extractIntervals(props: IProps): IInterval[] {
        const {intervals} = props.params;
        return map(intervals.split(","), interval => find(INTERVALS, {
            shortName: interval
        }));
    }
    
    _guess = (interval: IInterval) => {
        const {currentInterval} = this.state;
        const intervals = this._extractIntervals(this.props);
        if (isEqual(interval, currentInterval)) {
            alert("Correct!");
            this._pickInterval(intervals);
        } else {
            alert("Try again.");
        }
    }

    render() {
        const {dispatch, playingInterval} = this.props;
        const {currentInterval} = this.state;
        const intervals = this._extractIntervals(this.props);

        return <div>
            <h3>
                What interval was that?
                <div className={TestCSS.Actions}>
                    <Button onClick={this._playCurrentInterval} disabled={playingInterval} bsStyle="link">
                        <span className="fa-play fa" />{"\u00a0"}
                        Play again
                    </Button>{"\u00a0"}
                    <Button onClick={() => this._pickInterval(intervals)} disabled={playingInterval} bsStyle="link">
                        <span className="fa-forward fa" />{"\u00a0"}
                        Give up
                    </Button>
                </div>
            </h3>
            <div className={TestCSS.OptionGroup}>
                {map(intervals, interval => <Col xs={6} sm={3} md={2} lg={2} className={TestCSS.Option}>
                    <Button key={interval.shortName} style={{width: "100%"}} onClick={() => this._guess(interval)}>
                        {interval.name}
                    </Button>
                </Col>)}
            </div>
            <br />
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
