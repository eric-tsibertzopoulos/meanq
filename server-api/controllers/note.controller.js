const Note = require('../models/note.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
    console.log(">>API Call: Create...");
    if(!req.body.content) {
        return res.status(400).send({message: "Note content can not be empty"});
    }

    // Create a Note
    const note = new Note({
        title: req.body.title || "Untitled Note", 
        content: req.body.content,
        category: req.body.category
    });

    // Save Note in the database
    note.save()
    .then(data => {
        res.status(201).send(data);
    }).catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while creating the Note."});
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    console.log(">>API Call: Get All...");
    Note.find()
    .then(notes => {
        res.status(200).send(notes);
    }).catch(err => {
        res.status(500).send({message: err.message || "Some error occurred while retrieving notes."});
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
    console.log(">>API Call: Get by ID...");
    Note.findById(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({message: "Note not found with id " + req.params.noteId});            
        }
        res.status(200).send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({message: "Note not found with id " + req.params.noteId});                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.noteId
        });
    });

};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {
    console.log(">>API Call: Update...");
    if(!req.body.content) {
        return res.status(400).send({message: "Note content can not be empty"});
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, {
        title: req.body.title || "Untitled Note",
        content: req.body.content,
        category: req.body.category
    }, {new: true}) //return the modified document to the then() function instead of the original
    .then(note => {
        if(!note) {
            return res.status(404).send({message: "Note not found with id " + req.params.noteId});
        }
        res.status(200).send(note);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({message: "Note not found with id " + req.params.noteId});                
        }
        return res.status(500).send({message: "Error updating note with id " + req.params.noteId});
    });

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    console.log(">>API Call: Delete...");
    Note.findByIdAndRemove(req.params.noteId)
    .then(note => {
        if(!note) {
            return res.status(404).send({message: "Note not found with id " + req.params.noteId});
        }
        res.status(200).send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({message: "Note not found with id " + req.params.noteId});                
        }
        return res.status(500).send({message: "Could not delete note with id " + req.params.noteId});
    });

};