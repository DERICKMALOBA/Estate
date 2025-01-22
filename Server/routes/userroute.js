import express from 'express';
import { deleteUser, test, updateUser,  getUser, getUserListings} from '../Controllers/usercontroller.js';
import { verifyToken } from '../Utills/verifyUser.js';


const useRouter = express.Router();

useRouter.get('/test', test);
useRouter.post('/update/:id', verifyToken, updateUser)
useRouter.delete('/delete/:id', verifyToken, deleteUser)
useRouter.get('/listings/:id', verifyToken, getUserListings)
useRouter.get('/:id', verifyToken, getUser)

export default useRouter;