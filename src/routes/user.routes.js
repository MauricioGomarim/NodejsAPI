const { Router } = require('express')
const UserController = require('../controller/UserController')

const userController = new UserController;

const userRoutes = Router();


userRoutes.post('/', userController.create)
userRoutes.delete('/:id', userController.delete)
userRoutes.put('/:id', userController.update)

module.exports = userRoutes