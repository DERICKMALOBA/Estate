import express from 'express';
import {  signOut, signin, signup } from '../Controllers/AuthController.js';

const AuthRouter = express.Router();

AuthRouter.post("/signup", signup);
AuthRouter.post("/signin", signin);

AuthRouter.get('/signout', signOut)

export default AuthRouter;