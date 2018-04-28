import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import {CSVLink} from 'react-csv';
import { API } from "aws-amplify";
import "./Home.css";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            notes: [],
            notesArray: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const notes = await this.notes();
            this.setState({ notes });
            let contentArray = [];
            for (let note of notes) {
                // console.log(note.content)
                contentArray.push([note.content])
            }
            this.setState({ notesArray: contentArray })
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    notes() {
        return API.get("notes", "/notes");
    }

    renderNotesList(notes) {

        return [{}].concat(notes).map(
            (note, i) =>
                i !== 0
                    ? <ListGroupItem
                    key={note.noteId}
                    href={`/notes/${note.noteId}`}
                    onClick={this.handleNoteClick}
                    header={note.content.trim().split("\n")[0]}
                >
                    {"Created: " + new Date(note.createdAt).toLocaleString()}
                </ListGroupItem>
                    : <ListGroupItem
                    key="new"
                    href="/notes/new"
                    onClick={this.handleNoteClick}
                >
                    <h4>
                        <b>{"\uFF0B"}</b> Create a new note
                    </h4>
                </ListGroupItem>
        );
    }

    handleNoteClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    downloadCSV = event => {
        event.preventDefault();
        console.log("Content of Notes array: ", this.state.notesArray);
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>WhiteBard</h1>
                <p>An elegant note taking app</p>
                <div>
                    <Link to="/login" className="btn btn-info btn-lg">
                        Login
                    </Link>
                    <Link to="/signup" className="btn btn-success btn-lg">
                        Signup
                    </Link>
                </div>
            </div>
        );
    }

    renderNotes() {
        return (
            <div className="notes">
                <PageHeader>Your Notes</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderNotesList(this.state.notes)}
                </ListGroup>
                <CSVLink data={this.state.notesArray}
                         filename="mynotes.csv"
                         className="btn btn-primary btn-lg"
                         target="_blank"
                >
                    Download CSV</CSVLink>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
            </div>
        );
    }
}