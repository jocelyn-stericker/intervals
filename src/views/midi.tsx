import React = require("react");
import {forEach} from "lodash";

import Store from "../data/store";

import DragonApp from "../dragon/frontend/dragonApp";
import WebBackend, {ensureEnabled as ensureAudioEnabled, isSupported as webBackendSupported} from "../dragon/backends/web/web";
import PhysicalOutput from "../dragon/frontend/physicalOutput";
import PhysicalInput from "../dragon/frontend/physicalInput";
import DummyBackend from "../dragon/backends/dummy/dummy";
import {IMidiEv} from "../dragon/backends/spec";
import Synth from "../dragon/frontend/synth";
import MidiBridge from "../dragon/frontend/midiBridge";

const DragonBackend = webBackendSupported ? WebBackend : DummyBackend;
ensureAudioEnabled();

export interface IProps {
    enabledNotes: {[key: string]: boolean};
    onInputEventsChanged?: (currentNotes: {[key: number]: IMidiEv}) => void;
}

export interface IState {
}

export default class MIDI extends React.Component<IProps, IState> {
    _onDragonMessage = (msg: any) => {
        console.log(msg);
    };
    _onDragonStateChanged = (msg: any) => {
        console.log(msg);
    };

    render() {
        let {onInputEventsChanged} = this.props;

        return <DragonApp backend={DragonBackend} onMessage={this._onDragonMessage} onStateChanged={this._onDragonStateChanged}>
            <PhysicalOutput all audio>
                <Synth
                        onReady={() => this.setState({midiLoading: false})}
                        soundfont=""
                        channels={[
                            {
                                program: 0
                            }
                        ]}>
                    <MidiBridge channel={0} ref="midiBridge" />
                    <PhysicalInput all midi />
                </Synth>
                <MidiBridge channel={0} onCurrentEventsChanged={onInputEventsChanged}>
                    <PhysicalInput all midi />
                </MidiBridge>
            </PhysicalOutput>
        </DragonApp>;
    }

    componentWillReceiveProps(nextProps: IProps) {
        forEach(nextProps.enabledNotes, (t, enabledNote) => {
            if (!this.props.enabledNotes || !this.props.enabledNotes[enabledNote]) {
                if (parseInt(enabledNote, 10) > -1000) {
                    (this.refs["midiBridge"] as any).noteOn(enabledNote, 128);
                }
            }
        });

        forEach(this.props.enabledNotes, (t, enabledNote) => {
            if (!nextProps.enabledNotes[enabledNote]) {
                if (parseInt(enabledNote, 10) > -1000) {
                    (this.refs["midiBridge"] as any).noteOff(enabledNote);
                }
            }
        });
    }
}
