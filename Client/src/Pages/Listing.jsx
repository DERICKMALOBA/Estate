import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from 'react-icons/fa';
import Contact from '../Components/Contact';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  useEffect(() => {
    if (!currentUser) {
      // Handle the case where the user is not logged in
      console.log('No current user');
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!params.listingId) {
        console.error('listingId is undefined');
        setError(true);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data && data.success !== false) {
          setListing({ ...data, activeIndex: 0 });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  

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
              <span className="font-semibold text-black">Description  </span>
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
          </div>
        </div>
      )}
    </main>
  );
}
