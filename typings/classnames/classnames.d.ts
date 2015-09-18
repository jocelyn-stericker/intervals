declare module "classnames" {
    type Arg1 = string | Object;
    type Arg2 = string | Object | Arg1;
    type Arg3 = string | Object | Arg2;
    type Arg = string | Object | Arg3;
    function classNames(...args: Arg[]): string;

    export = classNames;
}

declare module "classnames/dedupe" {
    type Arg1 = string | Object;
    type Arg2 = string | Object | Arg1;
    type Arg3 = string | Object | Arg2;
    type Arg = string | Object | Arg3;
    function classNames(...args: Arg[]): string;

    export = classNames;
}