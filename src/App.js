import React, { Component } from 'react';
import './App.css';

import MeetingList from 'Components/MeetingList'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import EditMeeting from 'Components/EditMeeting';
import NewMeeting from 'Components/NewMeeting'


class App extends Component {
	render() {
		return (
			<div>
				<div>
					<Link to="/">List</Link>
					<Link to="New">New</Link>
				</div>
				<Switch>
					<Route path="/New/">
						<NewMeeting/>
					</Route>
					<Route path="/Edit/:Id"
						render={(props) => (
							<EditMeeting {...props} key={this.props.Id} />
						)}
					>
					</Route>
					<Route path="/">
						<MeetingList />
					</Route>
				</Switch>

			</div>
		)
	}
}

export default App;
