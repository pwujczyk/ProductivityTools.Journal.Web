import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import * as moment from 'moment';
import NotesLabel from 'Components/NotesLabel'
import Notes from 'Components/Notes'
import * as apiService from 'services/apiService'
import { v4 as uuid } from 'uuid';


function MeetingItem(props) {

	const { meeting, ...rest } = props;
	const [workingEvent, setWorkingEvent] = useState();


	useEffect(() => {
		setWorkingEvent({ ...meeting });
	}, []);

	const [mode, setMode] = useState('readonly');
	let mt = moment(props.meeting.date);
	let dtDescription = mt.fromNow();
	let dtFormated = mt.format('YYYY.MM.DD hh:mm')
	const buttonStyle = { textAlign: 'left' }
	console.log("meeting");
	console.log(props.meeting);

	const edit = () => {

		//setMode('edit');
		meeting.notesList.forEach(element => {
			element.guid = uuid()
		});
		//setWorkingEvent(meeting);
		setWorkingEvent({ ...meeting, mode: 'edit' });
	}

	const updateState = (event) => {
		const value = event.target.value;
		const name = event.target.name
		// console.log("meeting from state meeting1");
		// console.log(meeting)
		// console.log(name);
		// let x = { ...workingEvent, [name]: value }
		// console.log(x);
		// setWorkingEvent(x)
		// console.log("meeting from state meeting2");
		// console.log(meeting)
		setWorkingEvent(prev => ({ ...prev, [name]: value }));
	}

	const updateElementInList = (value, journalItemDetailsGuid, field) => {
		let journalItemDetailNotes = value;
		let notes = workingEvent.notesList;
		var editedElement = notes.find(x => x.guid === journalItemDetailsGuid);
		editedElement[field] = journalItemDetailNotes;
		setWorkingEvent(prevMeeting => ({ ...prevMeeting, notesList: notes }));
	}
	const newJournalItemDetails = () => {
		//let newNotesList = meeting.notesList;
		let newNotesList = [...workingEvent.notesList, { type: 'new', notes: 'Add notes here', guid: uuid(), status: 'New' }]
		setWorkingEvent(prevWorkingEvent => ({ ...prevWorkingEvent, notesList: newNotesList }));
	}

	const save = () => {
		apiService.updateMeeting(workingEvent);
		workingEvent.notesList = workingEvent.notesList.filter((value, index, arr) => {
			return value.status != 'Deleted';
		})

		props.updateMeetingInList(workingEvent);
	}

	const close = () => {
		setWorkingEvent({ ...workingEvent, mode: 'readonly' });
		//setMode('readonly')
	}

	const getComponent = () => {
		console.log("working event");
		console.log(workingEvent);
		if (workingEvent != null) {
			if (workingEvent.mode == null || workingEvent.mode === 'readonly') {
				return (
					<fieldset key={workingEvent.meetingId}>
						<p>mode: {mode}</p>
						<legend>[{meeting.journalItemId}] {dtFormated} ({dtDescription}) - {meeting.subject} Treeid:{meeting.treeId}</legend>
						{meeting.notesList?.map(n => {
							return (<NotesLabel title={n.type} notes={n.notes} />)
						})}
						<p style={buttonStyle}>
							<Button variant="contained" color="primary" onClick={edit}>Edit</Button>
						</p>
					</fieldset>
				)
			}
			else {
				return (<fieldset>
					<p>mode: {mode}</p>
					<p>Title: {meeting.subject}</p>
					<Notes title='Subject' name='subject' notes={workingEvent.subject} updateState={updateState} />
					<hr></hr>
					{workingEvent.notesList.filter(x => x.status != 'Deleted').map(n => {
						return (<Notes title={n.type} notes={n.notes} name='notes' guid={n.guid} updateState={updateElementInList}></Notes>)
					})}
					{/* <Notes title='Before notes' name='beforeNotes' notes={meeting.beforeNotes} updateState={updateState} />
                <Notes title='During notes' name='duringNotes' notes={meeting.duringNotes} updateState={updateState} />
                <Notes title='After notes' name='afterNotes' notes={meeting.afterNotes} updateState={updateState} /> */}
					<Button variant="contained" color="primary" onClick={newJournalItemDetails}>Add details</Button>
					<Button variant="contained" color="primary" onClick={save}>Save</Button>
					<Button variant="contained" color="primary" onClick={close}>Close</Button>
					<div>{meeting.beforeNotes}</div>
				</fieldset>)
			}
		}
	}

	return <p>
		{getComponent()}
	</p>
}

export default MeetingItem;

