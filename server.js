const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const express = require('express');
const app = express();
const listNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(listNotes.slice(1));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public.index.html'));
});

function addNewNote(body, notesArray) {
    const newNote = body;
    if(!Array.isArray(notesArray))
        notesArray = [];
    if(notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

app.post('/api/notes', (req, res) => {
    const newNote = addNewNote(req.body, listNotes);
    res.json(newNote);
});

function deleteNote(id, notesArray) {
    for(let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];
        if(note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSynce(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 3)
            );
            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, listNotes);
    res.json(true);
});
app.listen(PORT, () => {
    console.log(`API server on port ${PORT}.`)
});