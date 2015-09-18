import {createStore, applyMiddleware} from "redux";
import {compose} from "lodash";
const thunkMiddleware = require("redux-thunk");

import {reducer} from "./reducers";

let createIntervalStore: any;

if (process.env.NODE_ENV === "dev") {
    createIntervalStore = compose(
        applyMiddleware(thunkMiddleware),
        require("redux-devtools").devTools()
    )(createStore);
} else {
    createIntervalStore = compose(
        applyMiddleware(thunkMiddleware)
    )(createStore);
}

const Store = createIntervalStore(reducer, {});
export default Store;
