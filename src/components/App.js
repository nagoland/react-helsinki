import React,{useState, useEffect} from "react"
import History from "./History"
import Note from "./Note"
import axios from 'axios'
import noteService from "../services/notes"
import Notification from "./Notification"
import Footer from "./Footer"


const App = () => {
      const [notes, setNotes] = useState([])
      const [input, setInput] = useState("")
      const [showAll, setShowAll] = useState(true)
      const [errorMessage, setErrorMessage] = useState('some error happened...')
      useEffect(() => {
        noteService
        .getAll()
        .then(initialNotes => {
          setNotes(initialNotes)
      }, [])
    })
      // console.log('render'+ notes.length +'notes')

      const addNote = (e) => {
        e.preventDefault()
        console.log("button clicked", input)
        const noteObject = {
          content: input,
          date: new Date().toISOString(),
          important: Math.random() > 0.5,
        }

        noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setInput('')
      })
      }

      const getInput = (e) => {
        e.preventDefault()
        setInput(e.target.value)

      }
      const notesToShow = showAll ? notes : notes.filter(note=> note.important === true)
      



      const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })

    }
    const row = () => notesToShow.map(note =>
      <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
    )
      
    return (
        <div>
          <h1>Notes</h1>
          <Notification message={errorMessage} />
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll?"important" : "all"}
            </button>
          </div>
          <ul>
              {row()}
          </ul>
          <form onSubmit={addNote}>
            <input onChange={getInput} value={input}/>
            <button type="submit">save</button>
          </form>

          <Footer />
        </div>
    )
  }

export default App