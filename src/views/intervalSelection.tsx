import React = require("react");
import {IInterval} from "../data/actions";

const IntervalSelectionCSS = require("./intervalSelection.css")

export interface IProps {
    onIntervalsChanged: (intervals: IInterval[]) => void;//this.props.onIntervalsChanged(this.props.intervals.concat(NEW INTERVAL))
    intervals: IInterval[];
}

export interface IState {
}

export default class IntervalSelection extends React.Component<IProps, IState> {
    render() {
        return <div className={IntervalSelectionCSS.main}>
            Options to select intervals for testing go here.
        </div>;
    }
}