import express from 'express';
import { createReview, getReviews, deleteReview } from '../Controllers/ReviewController.js';
import { verifyToken } from '../Utills/verifyUser.js';

const ReviewRouter = express.Router();

ReviewRouter.post('/:listingId', verifyToken, createReview);
ReviewRouter.get('/:listingId', getReviews);
ReviewRouter.delete('/:reviewId', verifyToken, deleteReview);

export default ReviewRouter;