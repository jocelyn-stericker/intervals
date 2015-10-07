import React = require("react");
import {connect} from "react-redux";
import {sample, random, without} from "lodash";
import {Button} from "react-bootstrap"

import {IAppState, IInterval, playInterval} from "../data/actions";

export interface IProps {
    intervals: IInterval[];
    playingInterval: boolean;
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
    playingInterval: state.playingInterval,
    intervals: state.intervals
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

    render() {
        const {intervals, dispatch, playingInterval} = this.props;
        const {currentInterval} = this.state;
        return <div>
            <div>
                {JSON.stringify(currentInterval)}
            </div>
            <Button onClick={this._playCurrentInterval} disabled={playingInterval}>
                <span className="fa-play fa" />{"\u00a0"}
                Play interval
            </Button>{"\u00a0"}
            <Button onClick={() => this._pickInterval(intervals)} disabled={playingInterval}>
                <span className="fa-forward fa" />{"\u00a0"}
                Give up
            </Button>
        </div>;
    }

    componentWillMount() {
        this._pickInterval(this.props.intervals);
    }
    
    componentDidMount() {
        this._playCurrentInterval();
    }
    
    componentWillReceiveProps(nextProps: IProps) {
        if (this.props.intervals !== nextProps.intervals) {
            this._pickInterval(nextProps.intervals);
        }
    }
    
    componentDidUpdate(oldProps: IProps, oldState: IState) {
        if (this.state.currentInterval !== oldState.currentInterval) {
            this._playCurrentInterval();
        }
    }
}
