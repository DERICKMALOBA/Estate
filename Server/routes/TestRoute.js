import express from 'express'
import test from '../Controllers/TestControler.js'
const TestRoute = express.Router();

TestRoute.get('/test', test )
 

export default TestRoute;
