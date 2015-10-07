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

export const INTERVALS: IInterval[] = [
    {
        name: "Unison",
        shortName: "unison",
        size: 1,
        quality: IntervalQuality.Perfect,
        semitones: 0
    },
    {
        name: "Minor Second",
        shortName: "m2",
        size: 2,
        quality: IntervalQuality.Minor,
        semitones: 1
    },
    {
        name: "Major Second",
        shortName: "M2",
        size: 2,
        quality: IntervalQuality.Major,
        semitones: 2
    },
    {
        name: "Minor Third",
        shortName: "m3",
        size: 3,
        quality: IntervalQuality.Minor,
        semitones: 3
    },
    {
        name: "Major Third",
        shortName: "M3",
        size: 3,
        quality: IntervalQuality.Major,
        semitones: 4
    },
    {
        name: "Perfect Fourth",
        shortName: "P4",
        size: 4,
        quality: IntervalQuality.Perfect,
        semitones: 5
    },
    {
        name: "Dimished Fifth",
        shortName: "dim5",
        size: 5,
        quality: IntervalQuality.Diminished,
        semitones: 6
    },
    {
        name: "Perfect Fifth",
        shortName: "P5",
        size: 5,
        quality: IntervalQuality.Perfect,
        semitones: 7
    },
    {
        name: "Minor Sixth",
        shortName: "m6",
        size: 6,
        quality: IntervalQuality.Minor,
        semitones: 8
    },
    {
        name: "Major Sixth",
        shortName: "M6",
        size: 6,
        quality: IntervalQuality.Major,
        semitones: 9
    },
    {
        name: "Minor Seventh",
        shortName: "m7",
        size: 7,
        quality: IntervalQuality.Minor,
        semitones: 10
    },
    {
        name: "Major Seventh",
        shortName: "M7",
        size: 7,
        quality: IntervalQuality.Major,
        semitones: 11
    },
    {
        name: "Perfect Octave",
        shortName: "P8",
        size: 8,
        quality: IntervalQuality.Perfect,
        semitones: 12
    },
    {
        name: "Minor Ninth",
        shortName: "m9",
        size: 9,
        quality: IntervalQuality.Minor,
        semitones: 13
    },
    {
        name: "Major Ninth",
        shortName: "M9",
        size: 9,
        quality: IntervalQuality.Major,
        semitones: 14
    },
    {
        name: "Minor Tenth",
        shortName: "m10",
        size: 10,
        quality: IntervalQuality.Minor,
        semitones: 15
    },
    {
        name: "Major Tenth",
        shortName: "M10",
        size: 10,
        quality: IntervalQuality.Major,
        semitones: 16
    },
    {
        name: "Perfect Eleventh",
        shortName: "P11",
        size: 11,
        quality: IntervalQuality.Perfect,
        semitones: 17
    },
    {
        name: "Diminished Twelfth",
        shortName: "dim12",
        size: 12,
        quality: IntervalQuality.Diminished,
        semitones: 18
    },
    {
        name: "Perfect Twelfth",
        shortName: "P12",
        size: 12,
        quality: IntervalQuality.Perfect,
        semitones: 19
    },
    {
        name: "Minor Thirteenth",
        shortName: "m13",
        size: 13,
        quality: IntervalQuality.Minor,
        semitones: 20
    },
    {
        name: "Major Thirteenth",
        shortName: "M13",
        size: 13,
        quality: IntervalQuality.Major,
        semitones: 21
    },
    {
        name: "Minor Fourteenth",
        shortName: "m14",
        size: 14,
        quality: IntervalQuality.Perfect,
        semitones: 22
    },
    {
        name: "Major Fourteenth",
        shortName: "M14",
        size: 14,
        quality: IntervalQuality.Major,
        semitones: 23
    },
    {
        name: "Perfect Fifteenth",
        shortName: "P15",
        size: 15,
        quality: IntervalQuality.Perfect,
        semitones: 24
    }
];

export interface IAppState {
    initialized: boolean;
    count: number;
    enabledNotes: {[key: string]: boolean};
    playingInterval: boolean;
}

/**
 * When you define a new action, add it here, and define a function below.
 */
export enum Action {
    INCREMENT,
    NOTE_ON,
    NOTE_OFF,
    PLAYING_INTERVAL_CHANGED
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

function _startingInterval() {
    return {
        type: Action[Action.PLAYING_INTERVAL_CHANGED],
        playingInterval: true
    }
}

function _endingInterval() {
    return {
        type: Action[Action.PLAYING_INTERVAL_CHANGED],
        playingInterval: false
    }
}

export function playInterval(interval: IInterval, root: number): ThunkFn {
    return (dispatch: (msg: any) => any, getState?: () => IAppState) => {
        dispatch(_startingInterval());
        dispatch(noteOn(root, random(80, 127)));
        delay(() => {
            dispatch(noteOff(root));
            dispatch(noteOn(root + interval.semitones, random(80, 127)));
            delay(() => {
                dispatch(_endingInterval());
                dispatch(noteOff(root + interval.semitones));
            }, random(200, 700));
        }, random(400, 700));
    };
}