import {forEach, find, isEqual, extend, delay, random} from "lodash";
import invariant = require("invariant");

export type ThunkFn = (dispatch: (msg: any) => any, getState?: () => IAppState) => void;

export enum IntervalQuality {
    Perfect,
    Major,
    Minor,
    Diminished,
    Augmented
}

export interface IInterval {
    name: string;
    shortName: string;
    size: number;
    quality: IntervalQuality;
    semitones: number;
}

export interface IAppState {
    initialized: boolean;
    count: number;
    enabledNotes: {[key: string]: boolean};
    intervals: IInterval[];
}

/**
 * When you define a new action, add it here, and define a function below.
 */
export enum Action {
    INCREMENT,
    NOTE_ON,
    NOTE_OFF,
    SET_INTERVALS
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

export function incrementTwice(): ThunkFn {
    return (dispatch: (msg: any) => any, getState?: () => IAppState) => {
        //function
        dispatch(increment(1));
        dispatch(increment(1));
    };
}

export function noteOn(note: number, velocity: number) {
    return {
        type: Action[Action.NOTE_ON],
        note,
        velocity
    };
}

export function noteOff(note: number) {
    return {
        type: Action[Action.NOTE_OFF],
        note
    };
}

export function setIntervals(intervals: IInterval[]) {
    return {
        type: Action[Action.SET_INTERVALS],
        intervals: intervals
    };
}

export function playInterval(interval: IInterval, root: number): ThunkFn {
    return (dispatch: (msg: any) => any, getState?: () => IAppState) => {
        dispatch(noteOn(root, random(80, 127)));
        delay(() => {
            dispatch(noteOff(root));
            dispatch(noteOn(root + interval.semitones, random(80, 127)));
            delay(() => {
                dispatch(noteOff(root + interval.semitones));
            }, random(200, 700));
        }, random(400, 700));
    };
}