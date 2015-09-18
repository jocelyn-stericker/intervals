import React = require("react");
import {connect} from "react-redux";

import {IAppState, increment, noteOn, noteOff} from "../data/actions";

export interface IProps {
    count: number; // Injected by @connect.
    enabledNotes: number; // Injected by @connect.
    dispatch: (action: any) => void; // Injected by @connect.
}

export interface IState {
}

@connect((state: IAppState) => ({
    count: state.count, // See count in props
    enabledNotes: state.enabledNotes // See enabledNotes in props
}))
export default class Home extends React.Component<IProps, IState> {
    state: IState = {
    };
    render() {
        const {count, dispatch, enabledNotes} = this.props;
        return <div>
            Welcome home. The count is {count}. Would you like to{" "}
            <a href="javascript:void(0)" onClick={() => dispatch(increment(1))}>
                increment it
            </a>?
            <br />
            <br />
            This does not actually have anything to do with intervals, it just shows you how
            actions work. Press ctrl+h or cmd+h to show the sidebar. Then press the above increment button.
            The sidebar shows you how actions affect the application state. In the sidebar, you can click
            on actions to undo them.
            <br />
            <br />
            Take a look at <code>src/views/home.tsx</code> for how actions are dispatched.
            See <code>src/data/actions.ts</code> for how actions are defined. See <code>src/data/reducers.ts</code>
            for how actions are run.
            <br />
            <br />
            Also try{" "}
            <a href="javascript:void(0)" onClick={() => dispatch(noteOn(60, 128))}>
                pressing a note
            </a> and{" "}
            <a href="javascript:void(0)" onClick={() => dispatch(noteOff(60))}>
                releasing it
            </a>.{" "}
            Right now, {Object.keys(enabledNotes).length} keys are pressed!
        </div>;
    }
}
