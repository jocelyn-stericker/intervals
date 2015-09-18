# Intervals
A tool for learning intervals by ear. A SE 390 group project.

## Setup

You need to have [node](https://nodejs.org/en/) installed.

Then, in Mac or Linux, run:
```
git clone git@github.com:jnetterf/intervals.git
cd ./intervals
npm install
```

## Running

To run the app and live-update on changes, run
```
npm start
```
Then, open up [localhost:8080](http://localhost:8080) in a browser. So far, it's only been tested in Chrome.

To lint and test the app, run
```
npm test
```

## Selected project structure

 - `src/index.tsx`: defines routes and launches application
 - `src/views/...`: individual route components and components the routes use go here
 - `src/data/actions.ts`: defines the app state and defines all actions that can be done in the app, but does not
   perform the actions. See the Redux tutorial below.
 - `src/data/reducers.ts`: defined functions for performing actions. See the Redux tutorial below.
 - `src/satie`: Sheet music rendering. A git subtree of https://github.com/jnetterf/satie
 - `src/dragon`: MIDI/Audio A git subtree with tools for declarative Audio/MIDI output

## Ecosystem

Intervals uses a few tools. Links here are for documentation

 - [React](https://facebook.github.io/react/docs/tutorial.html) for rendering to the DOM and to audio declaratively.
 - TypeScript for ES 2015 and [types](http://www.typescriptlang.org/Handbook). See the TypeScript link for
   an overview of types. Babel provides an excellent [ES 2015 guide](https://babeljs.io/docs/learn-es2015/)
 - [React router](https://github.com/rackt/react-router) for URLs.
 - [Redux](https://rackt.github.io/redux/) for actions
 - CSS modules

### Potentially confusing ES 2015/TS features

Please see the ES 2015 guide and TypeScript guides above for a more details.

 - `let` and `const` are blocked-scoped versions of `var`. `const` only means a variable cannot be set.
    If it points to an object/array, the object/array can still be modified.
 - `return (arg) => arg + 4` is shorthand for `return function(arg) { return arg + 4; }`
 - `return (arg) => this.save(arg)` is shorthand for `let self = this; return function(arg) { return self.save(arg); }`
 - `let {a} = foo;` is shorthand for `let a = foo.a`.
 - `as` is TypeScript's casting operator (so `a as number` is like `(cast(number) a)`)
 - The `:` after `let` or `const` is used to set a variable's type (e.g., `let a: number = null;`). It's not needed
   when the type can already be determined.

### TypeScript imports

TypeScript provides multiple ways of importing:

 - `import React = require("react");` is used to import CommonJS (old-style) modules with typing.
 - `import {isEqual, find, findIndex} from "lodash";` is used to selectively import from CommonJS or ES 6 modules with typing.
 - `import Foo from "foo";` is used to import the default export (i.e., the export named "default") from an ES 6 module with typing.
 - `const thunkMiddleware = require("redux-thunk");` is used to import CommonJS (old-style) modules without typing.
 
### Tooling

[Visual Studio Code](https://www.visualstudio.com/en-us/products/code-vs.aspx) and Atom both have TypeScript +
JSX integration. In Atom, you need `atom-typescript`. In Code, to get full language support for TSX files, you
need to install the latest TypeScript 1.6 version (`npm install -g typescript@1.6`) and configure VS Code to use
it with the typescript.tsdk setting (see Code settings)
