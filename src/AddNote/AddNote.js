import React, { Component } from "react"
import ApiContext from "../ApiContext"
import config from "../config"
import ValidationError from "../ValidationError/ValidationError"
import "./AddNote.css"

export default class AddNote extends Component {
  static contextType = ApiContext

  state = {
    name: {
      value: "",
      touched: false,
    },
    error: null,
  }

  updateName(name) {
    this.setState({ name: { value: name, touched: true } })
  }

  validateName() {
    const name = this.state.name.value.trim()
    if (name.length === 0) {
      return "The name field can not be empty"
    }
  }

  onAddNote = (e) => {
    e.preventDefault()
    const name = e.target.name.value
    const content = e.target.content.value
    const folderId = e.target.folderId.value
    const modified = new Date()
    const note = { name, content, folderId, modified }

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(note),
    })
      .then((res) => {
        this.context.getData()
        this.props.history.push("/")
      })
      .catch((error) => {
        this.setState({
          error:error.message
        })
      })
  }

  render() {
    return (
      <form id="add-note" onSubmit={this.onAddNote}>
      {this.state.error}
        <label id="label"> Name </label>
        <input
          type="text"
          id="label"
          name="name"
          onChange={(e) => this.updateName(e.target.value)}
          // defaultValue="New Note"
        />
        {this.state.name.touched && (
          <ValidationError message={this.validateName()} />
        )}

        <label id="content"> Content </label>
        <input type="text" id="content" content="content" />
        <select name="folderId">
          {this.context.folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={this.validateName()}>
          submit
        </button>
      </form>
    )
  }
}
