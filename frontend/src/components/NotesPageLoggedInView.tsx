import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { Note as NoteModel } from '../models/note';
import * as NotesApi from '../network/note_api';
import styles from '../styles/NotesPage.module.css';
import styleUtils from '../styles/utils.module.css';
import {
  default as AddEditNoteDialog,
  default as AddEditNoteDialogProps,
} from './AddEditNoteDialogProps';
import Note from './Note';

const NotesPageLoggedInView = () => {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }
    }
    loadNotes();
  }, []);

  async function deleteNote(note: NoteModel) {
    try {
      await NotesApi.deleteNote(note._id);
      setNotes(notes.filter((existingNote) => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const notesGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
      {notes.map((note) => {
        return (
          <Col>
            <Note
              note={note}
              key={note._id}
              className={styles.note}
              onNoteClicked={(note) => setNoteToEdit(note)}
              onDeleteNoteClicked={deleteNote}
            />
          </Col>
        );
      })}
    </Row>
  );

  return (
    <>
      <Button
        onClick={() => setShowAddNoteDialog(true)}
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}>
        <FaPlus />
        Add New Note
      </Button>
      {notesLoading && <Spinner animation="border" variant="primary" />}
      {showNotesLoadingError && <p>Something went wrong. Please refresh the page</p>}
      {!notesLoading && !showNotesLoadingError && (
        <>{notes.length > 0 ? notesGrid : <p>You don't have any notes yes</p>}</>
      )}
      {showAddNoteDialog && (
        <AddEditNoteDialogProps
          onDissmis={() => setShowAddNoteDialog(false)}
          onNotesSaved={(newNote) => {
            setNotes([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        />
      )}

      {noteToEdit && (
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDissmis={() => setNoteToEdit(null)}
          onNotesSaved={(updatedNote) => {
            setNotes(
              notes.map((existingNote) =>
                existingNote._id === updatedNote._id ? updatedNote : existingNote,
              ),
            );
            setNoteToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default NotesPageLoggedInView;
