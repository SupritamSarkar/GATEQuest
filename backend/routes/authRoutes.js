import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';    // Importing authentication middleware

import { registerUser, loginUser, getUserInfo } from '../controllers/authControllers.js';  // Importing controller functions

const routers = express.Router();       // Creating a new router instance

routers.post('/register', registerUser);        // Route for user registration

routers.post('/login', loginUser);      // Route for user login

routers.get('/getUser', authMiddleware, getUserInfo);      // Route to get user information, protected by authentication middleware

export default routers;
