import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import * as moment from 'moment';
import NotesLabel from 'Components/NotesLabel'
import Notes from 'Components/Notes'
import * as apiService from 'services/apiService'
import { v4 as uuid } from 'uuid';
import { useDrag } from 'react-dnd'


function Page(props) {

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

		console.log()
		//setMode('edit');
		setWorkingEvent({ ...meeting, mode: 'edit' });
	}

	const updateState = (event) => {
		const value = event.target.value;
		const name = event.target.name
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
		let newNotesList = [...workingEvent.notesList, { type: 'new', notes: 'Add notes here', guid: uuid(), status: 'New' }]
		setWorkingEvent(prevWorkingEvent => ({ ...prevWorkingEvent, notesList: newNotesList }));
	}


	const save = async () => {
		let eventSum = undefined;//we need it to keep mode=edit, which is not returned from server
		workingEvent.notesList.forEach(x => x.notesType = 'Slate');
		if (workingEvent.journalItemId == null) {
			let savedEvent = await apiService.saveMeeting(workingEvent);
			eventSum = { ...workingEvent, ...savedEvent }
			setWorkingEvent(eventSum);
		} else {
			apiService.updateJournal(workingEvent);
			debugger;
			//check if this loop is needed
			let notesListRemoved = workingEvent.notesList.filter((value, index, arr) => {
				return value.status != 'Deleted';
			})
			eventSum = { ...workingEvent, notesList: notesListRemoved }

		}
		props.updateMeetingInList(eventSum);
	}

	const close = () => {
		setWorkingEvent({ ...workingEvent, mode: 'readonly' });
	}

	const getSlateStructureFromRawDetails = (rawDetails, title) => {
		let template = [{
			type: 'title',
			children: [{ text: title || "Title" }],
		}, {
			type: 'paragraph',
			children: [{ text: rawDetails || "No data" }],
		},]
		return template;
	}

	const deletePage = () => {
		console.log("delete whole journal item")
		console.log(workingEvent);
		apiService.deleteMeeting(workingEvent.journalItemId);
		removePageFromList(workingEvent);
	}

	const removePageFromList = (page) => {
		page.Deleted = true;
		props.updateMeetingInList(page);
	}

	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'page',
		item: { page: meeting, removePageFromList: removePageFromList },
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		})
	}))


	const getComponent2 = () => {
		console.log("working event");
		console.log(workingEvent);
		if (workingEvent != null) {
			if (workingEvent.mode == null || workingEvent.mode === 'readonly') {

				let notes = null;
				if (workingEvent.notesType == 'Slate') {
					let dt = workingEvent.notes;
					try {
						dt = JSON.parse(workingEvent.notes)
						notes = { detailsType: '', details: dt, name: workingEvent.type, elementId: "qwerty4" }
					} catch (error) {
						notes = { detailsType: '', details: getSlateStructureFromRawDetails(workingEvent.notes, "Notes item title (before, after)"), name: workingEvent.type, elementId: "qwerty6" }

					}
				}
				else {
					notes = { detailsType: '', details: getSlateStructureFromRawDetails(workingEvent.notes, "Notes item title (before, after)"), name: workingEvent.type, elementId: "qwerty6" }
				}

				return (
					<fieldset key={workingEvent.meetingId} ref={drag}>
						<p>mode: {mode}  <span>{isDragging && '😱'}</span></p>
						<legend>[{meeting.pageId}] {dtFormated} ({dtDescription}) - {meeting.subject} Treeid:{meeting.journalId}</legend>
						<NotesLabel title={workingEvent.type} notes={workingEvent.notes} selectedElement={notes} readOnly={true} />
						<p style={buttonStyle}>
							<Button variant="contained" color="primary" onClick={edit}>Edit</Button>
						</p>
					</fieldset>
				)
			}
			else {
				let notes = null;
				if (workingEvent.notesType == 'Slate') {
					let dt = workingEvent.notes;
					try {
						dt = JSON.parse(workingEvent.notes)
						notes = { detailsType: '', details: dt, name: workingEvent.type, elementId: "qwerty1" }

					} catch (error) {
						notes = { detailsType: '', details: getSlateStructureFromRawDetails(workingEvent.notes, "Notes item title (before, after)"), name:workingEvent.type, elementId: "qwerty6" }

					}
				}
				else {
					notes = { detailsType: '', details: getSlateStructureFromRawDetails(workingEvent.notes, "Notes item title (before, after)."), name: workingEvent.type, elementId: "qwerty2" }
				}
				console.log("notes", notes);
				return (<fieldset>
					<p>Title: {meeting.subject}</p>
					{/* <Notes title='Subject' name='subject' notes={workingEvent.subject} updateState={updateState} /> */}
					<hr></hr>
					<Notes title={notes.type} notes={notes.notes} name='notes' guid={notes.guid} updateState={updateElementInList} selectedElement={notes} readOnly={false}></Notes>)


					<Button variant="contained" color="primary" onClick={save}>Save</Button>
					<Button variant="contained" color="primary" onClick={close}>Close</Button>
					<Button variant="outlined" color="primary" onClick={newJournalItemDetails}>Add details</Button>
					<Button variant="outlined" color="primary" onClick={deletePage}>Delete page</Button>
					{/* <div>{meeting.beforeNotes}</div> */}
				</fieldset>)
			}
		}
	}

	return <div>
		{getComponent2()}
	</div>
}

export default Page;

