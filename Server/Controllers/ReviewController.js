import Review from '../models/reviewModel.js';

// Create a new review
export const createReview = async (req, res) => {
  const { listing, rating, reviewText } = req.body;

 

  if (!listing || !rating || !reviewText) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!req.user?._id || !req.user?.username) {
    return res.status(400).json({ 
      message: 'User information missing from token',
      receivedUser: req.user // For debugging
    });
  }

  try {
    const review = new Review({
      listing,
      user: req.user._id,
      username: req.user.username,
      userAvatar: req.user.avatar, // Optional if available
      rating,
      reviewText,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating review',
      error: error.message
    });
  }
};




// Backend controller
export const getReviews = async (req, res, next) => {
  try {
    const { listingId } = req.params; // Changed from 'listing' to 'listingId' to match frontend

    const reviews = await Review.find({ listing: listingId })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar');

    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(errorHandler(404, 'Review not found'));
    }

    // Check if user is the review owner or admin
    if (review.user.toString() !== userId && !req.user.isAdmin) {
      return next(errorHandler(403, 'You can only delete your own reviews'));
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json('Review has been deleted');
  } catch (error) {
    next(error);
  }
};