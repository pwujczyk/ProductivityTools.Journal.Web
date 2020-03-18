import React from 'react';
import Notes from 'Components/Notes'
import * as Consts from 'Consts';
import Button from '@material-ui/core/Button'

function NewMeeting() {

    let meeting ={beforeNotes:'',duringNotes:'',afterNotes:''}

    const updateState=(event) =>{
        const value = event.target.value;
        const name = event.target.name;
        meeting={...meeting,[name]:value}
    }

    const save=()=>{
        debugger;
        console.log("Save meeting");
        fetch(`${Consts.PATH_BASE}${Consts.PATH_MEETINGS_CONTROLER}/${Consts.PATH_MEETING_NEW_MEETING}`, {
            mode: 'cors',
            crossDomain: true,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meeting)
        })
            .then(respone => respone.json())
            .then(result => this.setMeeting(result))
            .catch(error => error);
        console.log("Finish post");
    }




    return (
        <div>
            <Notes title='Before notes' name='beforeNotes' notes={meeting.beforeNotes} updateState={updateState} />
            <Notes title='During notes' name='duringNotes' notes={meeting.duringNotes} updateState={updateState} />
            <Notes title='After notes' name='afterNotes' notes={meeting.afterNotes} updateState={updateState} />
            <Button variant="contained" color="primary" onClick={save}>Save</Button>
        </div>
    )

    
 
}

export default NewMeeting;