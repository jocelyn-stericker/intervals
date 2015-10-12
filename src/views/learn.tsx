import React = require("react");
import {Panel, PanelGroup, Button, Well, Grid, Row, Col} from "react-bootstrap";
import {connect} from "react-redux";
import {IAppState, INTERVALS, INote, playInterval, playNote, playSong} from "../data/actions";
import {find} from "lodash";

const LearnCSS = require("./learn.css")
const middleC = 60;

export interface IProps {
	dispatch: (action: any) => void; // Injected by @connect.
}

export interface IState {
}

function dot(note: number) {
	return (note + (0.5 * note));
}

// Here are some charted songs
// The tempo is in bpm and is a param to playSong
// A space between a block of notes indicates that
// it is a new bar.

const JAWS_BPM = 100;
const JAWS_TSIG = 4;
const JAWS: INote[] = [
	{ midi: 28, type: 1/8 },
	{ midi: 29, type: 1/8 },
	{ midi: 28, type: 1/8 },
	{ midi: 29, type: 1/8 },
	
	{ midi: 28, type: 1/8 },
	{ midi: 29, type: 1/8 },
	{ midi: 28, type: 1/8 },
	{ midi: 29, type: 1/8 }
];

const FRERE_JACQUES_BPM = 120;
const FRERE_JACQUES_TSIG = 4;
const FRERE_JACQUES: INote[] = [
	{ midi: 48, type: 1/4 },
	{ midi: 50, type: 1/4 },
	{ midi: 52, type: 1/4 },
	{ midi: 48, type: 1/4 },
	
	{ midi: 48, type: 1/4 },
	{ midi: 50, type: 1/4 },
	{ midi: 52, type: 1/4 },
	{ midi: 48, type: 1/4 },
	
	{ midi: 52, type: 1/4 },
	{ midi: 53, type: 1/4 },
	{ midi: 55, type: 1/2 },
];

const PINK_PANTHER_BPM = 130;
const PINK_PANTHER_TSIG = 4;
const PINK_PANTHER: INote[] = [
	{ midi: 63, type: 1/16 },
	
	{ midi: 64, type: 1/4 },
	{ midi:  0, type: dot(1/8) },	
	{ midi: 65, type: 1/16 },
	{ midi: 67, type: 1/4 },
	{ midi:  0, type: dot(1/8) },	
	{ midi: 63, type: 1/16 },
	
	{ midi: 64, type: dot(1/8) },
	{ midi: 65, type: 1/16 },
	{ midi: 67, type: dot(1/8) },
	{ midi: 72, type: 1/16 },
	{ midi: 71, type: dot(1/8) },
	{ midi: 64, type: 1/16 },
	{ midi: 67, type: dot(1/8) },
	{ midi: 71, type: 1/16 },
	
	{ midi: 70, type: 1/2 },
	// A triplet over a 1/4 note is 0.083 of a note
	{ midi: 71, type: 0.083 },
	{ midi: 69, type: 0.083 },
	{ midi: 67, type: 0.083 },
	{ midi: 64, type: 0.083 },
	{ midi: 62, type: 0.083 },
	{ midi: 64, type: 0.083 },

	{ midi: 64, type: 1/2 }
];

const O_CANADA_BPM = 130;
const O_CANADA_TSIG = 4;
const O_CANADA: INote[] = [
	{ midi: 59, type: 1/2 },
	{ midi: 62, type: dot(1/4) },
	{ midi: 62, type: 1/8 },
	
	{ midi: 55, type: dot(1/2) }
];

const WINDMILL_HUT_BPM = 200;
const WINDMILL_HUT_TSIG = 4;
const WINDMILL_HUT: INote[] = [
	{ midi: 49, type: 1/8 },
	{ midi: 52, type: 1/8 },
	{ midi: 61, type: 1/2 },	
	
	{ midi: 49, type: 1/8 },
	{ midi: 52, type: 1/8 },
	{ midi: 61, type: 1/2 },
	
	{ midi: 63, type: dot(1/4) },
	{ midi: 64, type: 1/8 },
	{ midi: 63, type: 1/8 },
	{ midi: 64, type: 1/8 },
	
	{ midi: 63, type: 1/8 },
	{ midi: 59, type: 1/8 },
	{ midi: 56, type: 1/2 },
	
	{ midi: 56, type: 1/4 },
	{ midi: 49, type: 1/4 },
	{ midi: 52, type: 1/8 },
	{ midi: 54, type: 1/8 },
	
	{ midi: 56, type: dot(1/2) },
	
	{ midi: 56, type: 1/4 },
	{ midi: 49, type: 1/4 },
	{ midi: 52, type: 1/8 },
	{ midi: 54, type: 1/8 },
	
	{ midi: 51, type: dot(1/2) }
];

const WHEN_THE_SAINTS_BPM = 300;
const WHEN_THE_SAINTS_TSIG = 4;
const WHEN_THE_SAINTS: INote[] = [
	{ midi:  0, type: 1/4 },
	{ midi: 48, type: 1/4 },
	{ midi: 52, type: 1/4 },
	{ midi: 54, type: 1/4 },
	
	{ midi: 55, type: 1/1 },
	
	{ midi:  0, type: 1/4 },
	{ midi: 48, type: 1/4 },
	{ midi: 52, type: 1/4 },
	{ midi: 53, type: 1/4 },
	
	{ midi: 55, type: 1/1 },
	
	{ midi:  0, type: 1/4 },
	{ midi: 48, type: 1/4 },
	{ midi: 52, type: 1/4 },
	{ midi: 53, type: 1/4 },
	
	{ midi: 55, type: 1/2 },
	{ midi: 52, type: 1/2 },
	
	{ midi: 48, type: 1/2 },
	{ midi: 52, type: 1/2 },
	
	{ midi: 50, type: 1/1 }
];

const HERE_COMES_THE_BRIDE_BPM = 160;
const HERE_COMES_THE_BRIDE_TSIG = 4;
const HERE_COMES_THE_BRIDE: INote[] = [
	{ midi: 51, type: 1/4 },
	{ midi: 56, type: dot(1/8) },
	{ midi: 56, type: 1/16 },
	{ midi: 56, type: 1/2 },
	
	{ midi: 51, type: 1/4 },
	{ midi: 58, type: dot(1/8) },
	{ midi: 54, type: 1/16 },
	{ midi: 56, type: 1/2 },
	
	{ midi: 51, type: 1/4 },
	{ midi: 56, type: dot(1/8) },
	{ midi: 61, type: 1/16 },
	{ midi: 61, type: 1/4 },
	{ midi: 60, type: dot(1/8) },
	{ midi: 58, type: 1/16 },
	
	{ midi: 56, type: 1/4 },
	{ midi: 55, type: dot(1/8) },
	{ midi: 56, type: 1/16 },
	{ midi: 58, type: 1/2 }
];


const X_FILES_BPM = 135;
const X_FILES_TSIG = 4;
const X_FILES: INote[] = [
	{ midi: 60, type: 1/4 },
	
	{ midi: 67, type: 1/4 },
	{ midi: 65, type: 1/4 },
	{ midi: 67, type: 1/4 },
	{ midi: 71, type: 1/4 },
	
	{ midi: 67, type: dot(1/2) },
	{ midi:  0, type: 1/4 },
	
	{ midi:  0, type: dot(1/2) },
	{ midi: 60, type: 1/4 },
	
	{ midi: 67, type: 1/4 },
	{ midi: 65, type: 1/4 },
	{ midi: 67, type: 1/4 },
	{ midi: 72, type: 1/4 },
	
	{ midi: 0, type: dot(1/2) },
	{ midi: 75, type: 1/4 },
	
	{ midi: 74, type: 1/4 },
	{ midi: 72, type: 1/4 },
	{ midi: 71, type: 1/4 },
	{ midi: 72, type: 1/4 },
	
	{ midi: 67, type: dot(1/2) },
];
	
const SIMPSONS_BPM = 190;
const SIMPSONS_TSIG = 4;
const SIMPSONS: INote[] = [
	{ midi: 36, type: 1/2 },
	
	{ midi: 42, type: 1/2 },
	{ midi: 43, type: (1/1 + 1/2) },
	
	{ midi: 48, type: dot(1/4) },
	//{ midi: 52, type: 1/8 },
	//{ midi: 52, type: 1/8 },
	{ midi: 52, type: 1/4 },
	{ midi: 54, type: 1/4 },
	{ midi: 57, type: 1/8 },
	
	{ midi: 55, type: dot(1/4) },
	//{ midi: 52, type: 1/8 },
	//{ midi: 52, type: 1/8 },
	{ midi: 52, type: 1/4 },
	{ midi: 48, type: 1/4 },
	{ midi: 45, type: 1/8 },
	
	{ midi: 42, type: 1/8 },
	{ midi: 42, type: 1/8 },
	{ midi: 42, type: 1/8 },
	{ midi: 43, type: 1/8 },
];
	
@connect((state: IAppState) => ({
}))
export default class Learn extends React.Component<IProps, IState> {
	render() {
		const {dispatch} = this.props;
		return <div className={LearnCSS.main}>
			<PanelGroup defaultActiveKey="1" accordion>
				<Panel header="Minor 2nd" footer={null} id={null} onSelect={null} eventKey="1">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m2" }), middleC))
										}}>
								Play Minor 2nd
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playSong(JAWS, JAWS_BPM, JAWS_TSIG))
										}}>
								Jaws Theme
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playSong(PINK_PANTHER, PINK_PANTHER_BPM, PINK_PANTHER_TSIG));
										}}>
								Pink Panther Theme
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m2" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Major 2nd" footer={null} id={null} onSelect={null} eventKey="2">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M2" }), middleC))
										}}>
								Play Major 2nd
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playSong(FRERE_JACQUES, FRERE_JACQUES_BPM, FRERE_JACQUES_TSIG))
										}}>
								Frere Jacques
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M2" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M2" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Minor 3rd" footer={null} id={null} onSelect={null} eventKey="3">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m3" }), middleC))
										}}>
								Play Minor 3rd
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playSong(O_CANADA, O_CANADA_BPM, O_CANADA_TSIG))
										}}>
								O Canada
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playSong(WINDMILL_HUT, WINDMILL_HUT_BPM, WINDMILL_HUT_TSIG))
										}}>
								Windmill Hut (Zelda OOT)
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m3" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Major 3rd" footer={null} id={null} onSelect={null} eventKey="4">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M3" }), middleC))
										}}>
								Play Major 3rd
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playSong(WHEN_THE_SAINTS, WHEN_THE_SAINTS_BPM, WHEN_THE_SAINTS_TSIG))
										}}>
								When The Saints Come Marching In
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M3" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M3" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Perfect 4th" footer={null} id={null} onSelect={null} eventKey="5">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P4" }), middleC))
										}}>
								Play Perfect 4th
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playSong(HERE_COMES_THE_BRIDE, HERE_COMES_THE_BRIDE_BPM, HERE_COMES_THE_BRIDE_TSIG))
										}}>
								Here Comes The Bride
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P4" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P4" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Perfect 5th" footer={null} id={null} onSelect={null} eventKey="6">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P5" }), middleC))
										}}>
								Play Perfect 5th
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playSong(X_FILES, X_FILES_BPM, X_FILES_TSIG))
										}}>
								X-Files Theme
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P5" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P5" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Diminished 5th" footer={null} id={null} onSelect={null} eventKey="7">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "dim5" }), middleC))
										}}>
								Play Diminished 5th
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playSong(SIMPSONS, SIMPSONS_BPM, SIMPSONS_TSIG))
										}}>
								The Simpsons Theme
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "dim5" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "dim5" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Minor 6th" footer={null} id={null} onSelect={null} eventKey="8">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m6" }), middleC))
										}}>
								Play Minor 6th
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m6" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m6" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m6" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Major 6th" footer={null} id={null} onSelect={null} eventKey="9">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M6" }), middleC))
										}}>
								Play Major 6th
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M6" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M6" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M6" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Minor 7th" footer={null} id={null} onSelect={null} eventKey="10">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m7" }), middleC))
										}}>
								Play Minor 7th
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m7" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m7" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "m7" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Major 7th" footer={null} id={null} onSelect={null} eventKey="11">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M7" }), middleC))
										}}>
								Play Major 7th
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M7" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M7" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "M7" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
				<Panel header="Perfect Octave" footer={null} id={null} onSelect={null} eventKey="12">
					<Grid className={LearnCSS.grid}>
						<Row className={LearnCSS.gridRow}>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P8" }), middleC))
										}}>
								Play Perfect Octave 
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P8" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P8" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
							<Col xs={3} sm={3} md={3} lg={3}>
								<Button 
										onClick={() => {
											dispatch(playInterval(_.find(INTERVALS, { 'shortName': "P8" }), middleC))
										}}>
								&lt;placeholder&gt;
								</Button>
							</Col>
						</Row>
					</Grid>
				</Panel>
			</PanelGroup>
		</div>;
	}
}