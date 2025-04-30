import { useEffect, useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking,FaStar } from 'react-icons/fa';
import Contact from '../Components/Contact';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const reviewMsgRef = useRef(null);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      setAvgRating(0);
      return;
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    setAvgRating(total / reviews.length);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;

    try {
      if (!currentUser) {
        alert('Please sign in to leave a review!');
        return;
      }

      if (rating === 0) {
        alert('Please select a rating');
        return;
      }

      const reviewObj = {
        username: currentUser.username,
        reviewText,
        rating,
        listingId: params.listingId
      };

      const res = await fetch('/api/review/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reviewObj)
      });

      const result = await res.json();
      if (!res.ok) {
        return alert(result.message);
      
      }
      console.log(result.message)

      // Update reviews list
      const updatedReviews = [...reviews, result];
      setReviews(updatedReviews);
      calculateAverageRating(updatedReviews);
      reviewMsgRef.current.value = '';
      setRating(0);
      alert('Review submitted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };


  useEffect(() => {
    if (!currentUser) {
      // Handle the case where the user is not logged in
      console.log('No current user');
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchListingAndReviews = async () => {
      try {
        setLoading(true);
        // Fetch listing
        const listingRes = await fetch(`/api/listing/get/${params.listingId}`);
        const listingData = await listingRes.json();
        
        if (listingData) {
          setListing({ ...listingData, activeIndex: 0 });
          
          // Fetch reviews
          const reviewsRes = await fetch(`/api/review/${params.listingId}`);
          const reviewsData = await reviewsRes.json();
          
          if (reviewsData) {
            setReviews(reviewsData);
            calculateAverageRating(reviewsData);
          }
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListingAndReviews();
  }, [params.listingId]);
  
  const handleMpesaPayment = async () => {
    if (!currentUser) {
      alert('Please log in to make a payment.');
      return;
    }

    if (!phoneNumber) {
      alert('Please enter your phone number.');
      return;
    }

    setPaymentProcessing(true);

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: listing.
          regularPrice,
          listingName: listing.name,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Mpesa payment request sent to your phone. Please confirm.');
      }
    } catch (error) {
      console.error('Mpesa Payment Error:', error);
      alert('Something went wrong. Try again later.');
    } finally {
      setPaymentProcessing(false);
    }
  };
  useEffect(() => {
    if (listing && listing.imageUrls?.length > 0) {
      const interval = setInterval(() => {
        setListing((prevListing) => {
          const nextIndex = (prevListing.activeIndex + 1) % prevListing.imageUrls.length;
          return { ...prevListing, activeIndex: nextIndex };
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [listing]);

  const handleNextImage = () => {
    setListing((prevListing) => {
      const nextIndex = (prevListing.activeIndex + 1) % prevListing.imageUrls.length;
      return { ...prevListing, activeIndex: nextIndex };
    });
  };

  const handlePrevImage = () => {
    setListing((prevListing) => {
      const prevIndex = (prevListing.activeIndex - 1 + prevListing.imageUrls.length) % prevListing.imageUrls.length;
      return { ...prevListing, activeIndex: prevIndex };
    });
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && <p className="text-center my-7 text-2xl">Something went wrong!</p>}
      {listing && !loading && !error && (
        <div>
          {/* Image Slider */}
          <div className="relative overflow-hidden h-[550px]">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(100 / listing.imageUrls.length) * listing.activeIndex}%)`,
                width: `${listing.imageUrls.length * 100}%`,
              }}
            >
              {listing.imageUrls.map((url, index) => (
                <div key={index} className="flex-shrink-0" style={{ width: `${100 / listing.imageUrls.length}%` }}>
                  <img src={url} alt={`Image ${index + 1}`} className="w-full h-[550px] object-cover" />
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
            >
              &#10094;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-full"
            >
              &#10095;
            </button>
          </div>

          {/* Listing Details */}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ksh{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ksh {+listing.regularPrice - +listing.discountPrice} off
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
        

            {/* Contact Button */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
                <input
              type="text"
              placeholder="Enter your Mpesa phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border p-2 rounded w-full"
            />

            <button
              onClick={handleMpesaPayment}
              className="bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700"
              disabled={paymentProcessing}
            >
              {paymentProcessing ? 'Processing Payment...' : 'Pay via Mpesa'}
            </button>
          </div>
             <div className="max-w-4xl mx-auto p-3 my-7 border-t border-gray-200 pt-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xl font-semibold">Reviews ({reviews?.length || 0})</h4>
                          {reviews?.length > 0 && (
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    className={`h-5 w-5 ${star <= avgRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-gray-600">
                                {avgRating.toFixed(1)} out of 5
                              </span>
                            </div>
                          )}
                        </div>
          
                        {/* Review Form */}
                        {currentUser && (
                          <form onSubmit={submitReview} className="space-y-4">
                            <div className="space-y-2">
                              <h5 className="text-lg font-medium">Share your experience</h5>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600">Your rating:</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      type="button"
                                      key={star}
                                      onClick={() => setRating(star)}
                                      className="focus:outline-none"
                                    >
                                      <FaStar
                                        className={`h-6 w-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <textarea
                                ref={reviewMsgRef}
                                placeholder="What did you like or dislike about this property?"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                              />
                            </div>
                            
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Submit Review
                            </button>
                          </form>
                        )}
          
                        {/* Reviews List */}
                        <div className="space-y-6 mt-8">
                          {reviews?.length > 0 ? (
                            reviews.map((review) => (
                              <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                                <div className="flex items-start space-x-4">
                                  <div className="flex-shrink-0">
                                    <img
                                      src={review.userAvatar || '/images/default-avatar.png'}
                                      alt={review.username}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h5 className="font-medium">{review.username}</h5>
                                      <div className="flex items-center text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </div>
                                    </div>
                                    <div className="flex items-center mt-1">
                                      <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <FaStar
                                            key={star}
                                            className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="mt-2 text-gray-700">{review.reviewText}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No reviews yet. Be the first to review this property!</p>
                          )}
                        </div>
                      </div>
                    </div>
        </div>
      )}
    </main>
  );
}
