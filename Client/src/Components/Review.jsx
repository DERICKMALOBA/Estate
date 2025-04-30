import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

export default function ReviewForm({ listingId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${listingId}`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [listingId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId, rating, comment }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]); // Add new review to the list
        setRating(0);
        setComment('');
      } else {
        console.error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Write a Review</h3>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => {
            const ratingValue = i + 1;
            return (
              <label key={i}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  className="hidden"
                />
                <FaStar
                  className="cursor-pointer"
                  color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  size={24}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full p-3 border rounded-lg mb-2"
          rows="3"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          disabled={rating === 0}
        >
          Submit Review
        </button>
      </form>

      {/* Display Reviews */}
      <h3 className="text-lg font-medium mb-2">Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="border p-3 mb-3 rounded-lg">
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < review.rating ? "#ffc107" : "#e4e5e9"}
                  size={20}
                />
              ))}
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet. Be the first to review!</p>
      )}
    </div>
  );
}
