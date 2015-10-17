const IS_DEV = process.env.NODE_ENV === "dev";

import React = require("react");
import {Navbar, Nav, NavItem} from "react-bootstrap";
import {Link} from "react-router";
import {connect} from "react-redux";
import classNames = require("classnames");
const {DevTools, DebugPanel, LogMonitor} = IS_DEV && require("redux-devtools/lib/react");
const ChromeCSS = require("./chrome.css");

import {IMidiEv} from "../dragon/backends/spec";

import Store from "../data/store";
import {IAppState} from "../data/actions";

import MIDI from "./midi";

export interface IProps {
    children: any;
    enabledNotes: {[key: string]: boolean};
}

export interface IState {
    inputEvents: {[key: number]: IMidiEv};
}

@connect((state: IAppState) => ({enabledNotes: state.enabledNotes})) // Sets enabledNotes in props.
export default class Chrome extends React.Component<IProps, IState> {
    state: IState = {
        inputEvents: {}
    };

    private _onDragonMessage = (msg: any) => {
        console.log("From Audio/MIDI system: ", msg);
    };

    private _onDragonStateChanged = (msg: any) => {
        console.log("From Audio/MIDI system: ", msg);
    };

    private _handleInputEventsChanged = (events: {[key: number]: IMidiEv}) => {
        this.setState({
            inputEvents: events
        })
    }

    render() {
        const {enabledNotes} = this.props;
        const {inputEvents} = this.state;
        const toggleButton = {
            toggleButton: <button className="navbar-toggle fa fa-bars" type="button" style={{color: "#aaa"}} />
        };
        return <div>
            {IS_DEV && <DebugPanel top right bottom>
                <DevTools store={Store} monitor={LogMonitor} theme="bright" visibleOnLoad={false} />
            </DebugPanel>}

            <MIDI enabledNotes={enabledNotes} onInputEventsChanged={this._handleInputEventsChanged} />

            <Navbar brand="Interval training" staticTop={true} fluid={true} toggleButton toggleNavKey={1}
                    {...toggleButton}>
                <Nav eventKey={1}>
                    <li role="presentation">
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link to="/about">
                            About
                        </Link>
                    </li>
                    <li role="presentation">
                        <Link to="/intervalSelection">
                            Interval Selection
                        </Link>
                    </li>
                </Nav>
            </Navbar>

            <div className={classNames("container", ChromeCSS.content)}>
                {React.cloneElement(this.props.children, {
                    /* Injects inputEvents into child */
                    inputEvents
                })}
            </div>
        </div>;
    }
}
