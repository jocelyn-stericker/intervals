import React = require("react");
import {connect} from "react-redux";
import {IInterval, IntervalQuality, IAppState, setIntervals} from "../data/actions";
import {Tabs, Tab, Grid, Row, Col, Input, Button} from "react-bootstrap";
import {map, find, include, times, union, without, filter} from "lodash";
import classNames = require("classnames");

const IntervalSelectionCSS = require("./intervalSelection.css")

const intervals: IInterval[] = [
    {
        name: "Unison",
        shortName: "Unison",
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

export interface IProps {
    history: any; // Injected by router because this is top-level
    dispatch: (action: any) => void; // Injected by @connect.
}

export interface IState {
    checkedIntervals: IInterval[];
}

@connect((state: IAppState) => ({
}))
export default class IntervalSelection extends React.Component<IProps, IState> {
    state: IState = {
        checkedIntervals: filter(intervals, interval => interval.size <= 8)
    }
    
    private _onCheckboxClicked = (event: Event, interval: IInterval) => {
        var newIntervals: IInterval[];
        if (find(this.state.checkedIntervals, (checked) => checked === interval)) {
            newIntervals = without(this.state.checkedIntervals.slice(), interval);
        } else {
            newIntervals = union(this.state.checkedIntervals.slice(), [interval]);
        }
        this.setState({
            checkedIntervals: newIntervals
        });
    }

    private _renderInterval = (size: number, ...qualities: IntervalQuality[]) => {
        const interval = find(
            intervals,
            (interval) =>
                interval.size === size && include(qualities, interval.quality)
        );
        if (!interval) {
            return null;
        }
        // with includes, has to be the same instance.
        // see docs for deepEqual
        return <Input type="checkbox" onClick={(event:Event) => this._onCheckboxClicked(event, interval)} checked={
            include(this.state.checkedIntervals, interval)}
                label={<span>
                    <span className="visible-sm visible-md visible-lg">{interval.name}</span>
                    <span className="visible-xs">{interval.shortName}</span>
                </span>} />
    }

    private _startTest = () => {
        const {dispatch, history} = this.props;
        const {checkedIntervals} = this.state;

        dispatch(setIntervals(checkedIntervals)); // Set the intervals being tested
        history.pushState(null, "/test", null); // Go to the test page.
    }

    render() {
        const isValid = this.state.checkedIntervals.length > 1;

        return <div className={IntervalSelectionCSS.main}>
          <Tabs>
            <Tab eventKey={1} title="Individual Intervals">
              <form>
                <Grid>
                  <span className={classNames("visible-sm", "visible-md", "visible-xl")}>
                    <Row className={IntervalSelectionCSS.headerRow}>
                        <Col xs={6} sm={6} md={6} lg={6} className={IntervalSelectionCSS.showgrid}>
                        Simple
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} className={IntervalSelectionCSS.showgrid}>
                        Compound
                        </Col>
                    </Row>
                    <Row className={IntervalSelectionCSS.headerRow}>
                        <Col xs={3} sm={3} md={3} lg={3} className={IntervalSelectionCSS.showgrid}>
                        Major <span className="visible-xs">HAI</span>and Perfect
                        </Col>
                        <Col xs={3} sm={3} md={3} lg={3} className={IntervalSelectionCSS.showgrid}>
                        Minor and Diminished
                        </Col>
                        <Col xs={3} sm={3} md={3} lg={3} className={IntervalSelectionCSS.showgrid}>
                        Major and Perfect
                        </Col>
                        <Col xs={3} sm={3} md={3} lg={3} className={IntervalSelectionCSS.showgrid}>
                        Minor and Diminished
                        </Col>
                    </Row>
                  </span>
                  {times(7, rowNum => <Row key={rowNum}>
                    <Col xs={3} sm={3} md={3} lg={3} className={IntervalSelectionCSS.showgrid}>
                      { this._renderInterval(rowNum + 1, IntervalQuality.Perfect, IntervalQuality.Major) }
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3} className={IntervalSelectionCSS.showgrid}>
                      { this._renderInterval(rowNum + 1, IntervalQuality.Minor, IntervalQuality.Diminished) }
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3} className={IntervalSelectionCSS.showgrid}>
                      { this._renderInterval(rowNum + 8, IntervalQuality.Perfect, IntervalQuality.Major) }
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3} className={IntervalSelectionCSS.showgrid}>
                      { this._renderInterval(rowNum + 8, IntervalQuality.Minor, IntervalQuality.Diminished) }
                    </Col>
                  </Row>)}
                </Grid> 
              </form>
            </Tab>
            <Tab eventKey={2} title="RCM">
              RCM intervals are not implemented yet. Please use the individual intervals tab instead.
            </Tab>
            <Tab eventKey={3} title="Other Combinations">
              These combinations are not implemented yet. Please use the individual intervals tab instead.
            </Tab>
          </Tabs>
          <Button bsStyle="primary" onClick={this._startTest} className={IntervalSelectionCSS.actions}
                disabled={!isValid}>
            Start test »
          </Button>
        </div>;
    }
}