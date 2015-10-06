import React = require("react");
import {IInterval, IntervalQuality} from "../data/actions";
import {Tabs, Tab, Grid, Row, Col, Input} from "react-bootstrap";
import {map, find, include, times, union, without} from "lodash";

const IntervalSelectionCSS = require("./intervalSelection.css")

const intervals: IInterval[] = [
    {
        name: "Unison",
        size: 1,
        quality: IntervalQuality.Perfect,
        semitones: 0
    },
    {
        name: "Minor Second",
        size: 2,
        quality: IntervalQuality.Minor,
        semitones: 1
    },
    {
        name: "Major Second",
        size: 2,
        quality: IntervalQuality.Major,
        semitones: 2
    },
    {
        name: "Minor Third",
        size: 3,
        quality: IntervalQuality.Minor,
        semitones: 3
    },
    {
        name: "Major Third",
        size: 3,
        quality: IntervalQuality.Major,
        semitones: 4
    },
    {
        name: "Perfect Fourth",
        size: 4,
        quality: IntervalQuality.Perfect,
        semitones: 5
    },
    {
        name: "Dimished Fifth",
        size: 5,
        quality: IntervalQuality.Diminished,
        semitones: 6
    },
    {
        name: "Perfect Fifth",
        size: 5,
        quality: IntervalQuality.Perfect,
        semitones: 7
    },
    {
        name: "Minor Sixth",
        size: 6,
        quality: IntervalQuality.Minor,
        semitones: 8
    },
    {
        name: "Major Sixth",
        size: 6,
        quality: IntervalQuality.Major,
        semitones: 9
    },
    {
        name: "Minor Seventh",
        size: 7,
        quality: IntervalQuality.Minor,
        semitones: 10
    },
    {
        name: "Major Seventh",
        size: 7,
        quality: IntervalQuality.Major,
        semitones: 11
    },
    {
        name: "Perfect Octave",
        size: 8,
        quality: IntervalQuality.Perfect,
        semitones: 12
    },
    {
        name: "Minor Ninth",
        size: 9,
        quality: IntervalQuality.Minor,
        semitones: 13
    },
    {
        name: "Major Ninth",
        size: 9,
        quality: IntervalQuality.Major,
        semitones: 14
    },
    {
        name: "Minor Tenth",
        size: 10,
        quality: IntervalQuality.Minor,
        semitones: 15
    },
    {
        name: "Major Tenth",
        size: 10,
        quality: IntervalQuality.Major,
        semitones: 16
    },
    {
        name: "Perfect Eleventh",
        size: 11,
        quality: IntervalQuality.Perfect,
        semitones: 17
    },
    {
        name: "Diminished Twelfth",
        size: 12,
        quality: IntervalQuality.Diminished,
        semitones: 18
    },
    {
        name: "Perfect Twelfth",
        size: 12,
        quality: IntervalQuality.Perfect,
        semitones: 19
    },
    {
        name: "Minor Thirteenth",
        size: 13,
        quality: IntervalQuality.Minor,
        semitones: 20
    },
    {
        name: "Major Thirteenth",
        size: 13,
        quality: IntervalQuality.Major,
        semitones: 21
    },
    {
        name: "Minor Fourteenth",
        size: 14,
        quality: IntervalQuality.Perfect,
        semitones: 22
    },
    {
        name: "Major Fourteenth",
        size: 14,
        quality: IntervalQuality.Major,
        semitones: 23
    },
    {
        name: "Perfect Fifteenth",
        size: 15,
        quality: IntervalQuality.Perfect,
        semitones: 24
    }
];

export interface IProps {
    onIntervalsChanged: (intervals: IInterval[]) => void;//this.props.onIntervalsChanged(this.props.intervals.concat(NEW INTERVAL))
    //intervals: IInterval[]; Not currently needed
}

export interface IState {
    checkedIntervals: IInterval[];
}

export default class IntervalSelection extends React.Component<IProps, IState> {
    state: IState = {
        checkedIntervals: [intervals[0]]
    }
    
    onCheckboxClicked = (event: Event, interval: IInterval) => {
        var newIntervals: IInterval[];
        if(find(this.state.checkedIntervals, (checked) => checked === interval)){
            newIntervals = without(this.state.checkedIntervals, interval);
        } else {
            newIntervals = union(this.state.checkedIntervals, [interval]);
        }
        this.setState({checkedIntervals : newIntervals});
    }
    
    renderInterval = (size: number, ...qualities: IntervalQuality[]) => {
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
        return <Input type="checkbox" onClick={(event:Event) => this.onCheckboxClicked(event, interval)} checked={
            include(this.state.checkedIntervals, interval)} label={interval.name} />
    }
    
    render() {
        return <div className={IntervalSelectionCSS.main}>
          <Tabs>
            <Tab eventKey={1} title="Individual Intervals">
              <form>
                <Grid>
                  <Row className={IntervalSelectionCSS.headerRow}>
                    <Col md={6} className={IntervalSelectionCSS.showgrid}>
                      Simple
                    </Col>
                    <Col md={6} className={IntervalSelectionCSS.showgrid}>
                      Compound
                    </Col>
                  </Row>
                  <Row className={IntervalSelectionCSS.headerRow}>
                    <Col md={3} className={IntervalSelectionCSS.showgrid}>
                      Major and Perfect
                    </Col>
                    <Col md={3} className={IntervalSelectionCSS.showgrid}>
                      Minor and Diminished
                    </Col>
                    <Col md={3} className={IntervalSelectionCSS.showgrid}>
                      Major and Perfect
                    </Col>
                    <Col md={3} className={IntervalSelectionCSS.showgrid}>
                      Minor and Diminished
                    </Col>
                  </Row>
                  {times(8, rowNum => <Row key={rowNum}>
                    <Col md={3} className={IntervalSelectionCSS.showgrid}>
                      { this.renderInterval(rowNum + 1, IntervalQuality.Perfect, IntervalQuality.Major) }
                    </Col>
                    <Col md={3} className={IntervalSelectionCSS.showgrid}>
                      { this.renderInterval(rowNum + 1, IntervalQuality.Minor, IntervalQuality.Diminished) }
                    </Col>
                    <Col md={3} className={IntervalSelectionCSS.showgrid}>
                      { this.renderInterval(rowNum + 8, IntervalQuality.Perfect, IntervalQuality.Major) }
                    </Col>
                    <Col md={3} className={IntervalSelectionCSS.showgrid}>
                      { this.renderInterval(rowNum + 8, IntervalQuality.Minor, IntervalQuality.Diminished) }
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
        </div>;
    }
}