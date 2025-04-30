import express from 'express';
import { callback, generateToken, stkpush} from '../Controllers/mpesaController.js';


const mpesaRouter = express.Router();

// router.post('/', )
mpesaRouter.post('/callback',callback);
mpesaRouter.post('/mpesa/stkpush', generateToken,stkpush);
// router.get('/token',token)

export default mpesaRouter;