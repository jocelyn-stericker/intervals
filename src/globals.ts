/// <reference path="../typings/tsd.d.ts" />

import {init as initSatie} from "./satie/index";
import "whatwg-fetch";
require("./globals.css");

(function declareGlobals() {
    // Initialize libraries
    initSatie({
        satieRoot: "https://nettek.ca/satie/vendor/",
        preloadedFonts: ["Alegreya", "Alegreya (bold)"]
    });
}());
