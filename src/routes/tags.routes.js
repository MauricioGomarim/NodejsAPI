const { Router } = require('express')
const TagsController = require('../controller/TagsController')

const tagsController = new TagsController;

const tagsRoutes = Router();


tagsRoutes.get('/:id', tagsController.index)



module.exports = tagsRoutes