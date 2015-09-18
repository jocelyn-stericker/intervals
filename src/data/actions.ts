import {forEach, find, isEqual, extend} from "lodash";
import invariant = require("invariant");

export type ThunkFn = (dispatch: (msg: any) => any, getState?: () => IAppState) => void;

export interface IAppState {
    initialized: boolean;
    count: number;
    enabledNotes: {[key: string]: boolean};
}

/**
 * When you define a new action, add it here, and define a function below.
 */
export enum Action {
    INCREMENT,
    NOTE_ON,
    NOTE_OFF
}

/**
 * All actions extend this.
 */
export interface IAction {
    type?: Action;
}

export function increment(count: number) {
    return {
        type: Action[Action.INCREMENT],
        count, // Equivilent to count: count
    };
}

export function noteOn(note: number, velocity: number) {
    return {
        type: Action[Action.NOTE_ON],
        note,
        velocity
    }
}

export function noteOff(note: number) {
    return {
        type: Action[Action.NOTE_OFF],
        note
    }
}
