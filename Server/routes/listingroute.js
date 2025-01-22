import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../Controllers/ListingController.js';
import { verifyToken } from '../Utills/verifyUser.js';

const ListingRouter = express.Router();

ListingRouter.post('/create', verifyToken, createListing);
ListingRouter.delete('/delete/:id', verifyToken, deleteListing);
ListingRouter.post('/update/:id', verifyToken, updateListing);
ListingRouter.get('/get/:id', getListing);
ListingRouter.get('/get', getListings);

export default ListingRouter;
