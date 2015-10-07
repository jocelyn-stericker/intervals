import React = require("react");
import {connect} from "react-redux";
import {IInterval, IntervalQuality, IAppState, INTERVALS} from "../data/actions";
import {Tabs, Tab, Grid, Row, Col, Input, Button} from "react-bootstrap";
import {map, find, include, times, union, without, filter} from "lodash";
import classNames = require("classnames");

const IntervalSelectionCSS = require("./intervalSelection.css")

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
        checkedIntervals: filter(INTERVALS, interval => interval.size <= 8)
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
            INTERVALS,
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

        const intervals = map(checkedIntervals, interval => interval.shortName).join(",");
        history.pushState(null, `/test/${intervals}`, null); // Go to the test page.
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