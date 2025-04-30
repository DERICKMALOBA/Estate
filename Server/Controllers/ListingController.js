import Listing from '../models/listingmodel.js';
import Review from '../models/reviewModel.js';
import { errorHandler } from '../Utills/Error.js';

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    offer = offer === undefined || offer === 'false' ? { $in: [false, true] } : offer;

    let furnished = req.query.furnished;
    furnished = furnished === undefined || furnished === 'false' ? { $in: [false, true] } : furnished;

    let parking = req.query.parking;
    parking = parking === undefined || parking === 'false' ? { $in: [false, true] } : parking;

    let type = req.query.type;
    type = type === undefined || type === 'all' ? { $in: ['sale', 'rent'] } : type;

    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const query = {
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    };

    const listings = await Listing.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)
      .lean(); // lean() gives plain JS objects

    // Attach averageRating to each listing
    for (let listing of listings) {
      const ratings = await Review.find({ listing: listing._id }).select('rating');
      if (ratings.length === 0) {
        listing.averageRating = 0;
      } else {
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        listing.averageRating = sum / ratings.length;
      }
    }

    return res.status(200).json({
      status: true,
      count: listings.length,
      listings,
      message: 'Listings retrieved successfully',
    });
  } catch (error) {
    console.error('Error in getListings:', error);
    next(errorHandler(500, 'Internal server error'));
  }
};

