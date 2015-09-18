import {extend} from "lodash";

import {IAppState, IAction, Action} from "./actions";

let _reducers: {[key: string]: ((state: IAppState, action: IAction) => IAppState)} = {};

_reducers[Action.INCREMENT] = (state: IAppState, action: {count: number}) => {
    // In reducers, we do not modify state.
    // Instead, clone state, and in the clone, set count.
    state = extend({}, state, {
        count: state.count + action.count
    }) as IAppState;

    return state;
};

_reducers[Action.NOTE_ON] = (state: IAppState, action: {note: number, velocity: number}) => {
    state = extend({}, state) as IAppState;
    // Ignore velocity for now.
    state.enabledNotes = extend({}, state.enabledNotes, {
        [action.note]: true
    }) as typeof state.enabledNotes;
    return state;
};


_reducers[Action.NOTE_OFF] = (state: IAppState, action: {note: number}) => {
    state = extend({}, state) as IAppState;
    state.enabledNotes = extend({}, state.enabledNotes) as typeof state.enabledNotes;
    delete state.enabledNotes[action.note];
    return state;
};

export function reducer(state: IAppState, action: IAction) {
    if (Action[action.type] in _reducers) {
        return _reducers[Action[action.type]](state, action);
    }

    if (!state.initialized) {
        state = {
            initialized: true,
            enabledNotes: {},
            count: 0
        };
    }

    return state;
}
