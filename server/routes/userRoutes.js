const express = require('express');
const { login, signup } = require('../controllers/user');
const{body}=require('express-validator');


const userRouter = express.Router()
userRouter.post('/login',   [body('email').isEmail(),
     body('password', 'please enter 5 character password').isLength({ min: 5 })],login);
userRouter.post('/signup',[
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],signup );





module.exports = userRouter;
 