/** 
 * (C) Josh Netterfield <joshua@nettek.ca> 2015.
 * Part of the Dragon MIDI/audio library <https://github.com/ripieno/dragon>.
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import Effect, {IEffectArgs} from "./effect";
import {IMidiEv} from "../spec";

class WebMidiBridge extends Effect {
    state: any;
    currentNotes: {[key: number]: IMidiEv} = {};

    constructor(args: IEffectArgs) {
        super(args);
        this.state = {};
    }

    midiEvent(ev: IMidiEv) {
        let {currentNotes} = this;
        if (ev.type === "NOTE_ON") {
            currentNotes[ev.note] = ev;
        } else if (ev.type === "NOTE_OFF") {
            delete currentNotes[ev.note];
        }
        this.toUI({
            currentNotes
        });
    }

    fromUI(msg: any) {
        if (msg.event) {
            this.emitMidi(msg.event);
        }
    }
}

export default WebMidiBridge;
