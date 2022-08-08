const { Router } = require('express')
const NotesController = require('../controller/NotesController')

const notesController = new NotesController;

const notesRoutes = Router();


notesRoutes.post('/:user_id', notesController.create)
notesRoutes.delete('/:id', notesController.delete)
notesRoutes.get('/', notesController.index)
notesRoutes.get('/:id', notesController.show)


module.exports = notesRoutes