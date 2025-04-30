import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingItem from '../Components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [listing, setListing] = useState({
    activeIndex: 0,
    imageUrls: [],
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const offerResponse = await fetch('/api/listing/get?offer=true&limit=4');
        const offerData = await offerResponse.json();
        console.log('offer data',offerData)
        setOfferListings(Array.isArray(offerData) ? offerData : offerData.listings || []);
    
        const rentResponse = await fetch('/api/listing/get?type=rent&limit=4');
        const rentData = await rentResponse.json();
        console.log('rent',rentData)
        setRentListings(Array.isArray(rentData) ? rentData : rentData.listings || []);
    
        const saleResponse = await fetch('/api/listing/get?type=sale&limit=4');
        const saleData = await saleResponse.json();
        console.log("sales data", saleData)
        setSaleListings(Array.isArray(saleData) ? saleData : saleData.listings || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    

    fetchListings();
  }, []);

  useEffect(() => {
    const images = [
      ...offerListings.flatMap((listing) => listing.imageUrls || []),
      ...rentListings.flatMap((listing) => listing.imageUrls || []),
      ...saleListings.flatMap((listing) => listing.imageUrls || []),
    ];
    setListing((prevListing) => ({
      ...prevListing,
      imageUrls: images,
    }));
  }, [offerListings, rentListings, saleListings]);
  

  useEffect(() => {
    if (listing.imageUrls.length > 0) {
      const interval = setInterval(() => {
        setListing((prevListing) => ({
          ...prevListing,
          activeIndex:
            (prevListing.activeIndex + 1) % prevListing.imageUrls.length,
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [listing.imageUrls]);

  const handleNextImage = () => {
    setListing((prevListing) => ({
      ...prevListing,
      activeIndex:
        (prevListing.activeIndex + 1) % prevListing.imageUrls.length,
    }));
  };

  const handlePrevImage = () => {
    setListing((prevListing) => ({
      ...prevListing,
      activeIndex:
        (prevListing.activeIndex - 1 + prevListing.imageUrls.length) %
        prevListing.imageUrls.length,
    }));
  };

  return (
    <div>
      {/* Top section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-center text-slate-700 font-bold text-3xl lg:text-6xl">
          Discover your <span className="text-slate-500">dream</span> home
          <br />
          effortlessly today
        </h1>
        <div className="text-cyan-600 text-xs sm:text-sm text-center">
          Elevate Estates: Where dreams meet homes.
          <br />
          Explore exceptional properties tailored just for you.
        </div>
        <div className="flex justify-center mt-8">
          <Link
            to={'/search'}
            className="px-6 py-3 text-sm sm:text-base font-bold text-white bg-blue-800 bg-opacity-75 rounded-lg transition-transform transform hover:scale-105 hover:bg-opacity-90 focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Get started...
          </Link>
        </div>
      </div>

      {/* Image Slider */}
      <div className="relative overflow-hidden h-[550px]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${
              (100 / listing.imageUrls.length) * listing.activeIndex
            }%)`,
            width: `${listing.imageUrls.length * 100}%`,
          }}
        >
          {listing.imageUrls.map((url, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / listing.imageUrls.length}%` }}
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-[550px] object-cover"
              />
            </div>
          ))}
        </div>

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

      {/* Listings */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent offers
            </h2>
            <Link
              to={'/search?offer=true'}
              className="text-sm text-blue-800 hover:underline"
            >
              Show more offers
            </Link>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-600">
              Houses for rent
            </h2>
            <Link
              to={'/search?type=rent'}
              className="text-sm text-blue-800 hover:underline"
            >
              Show more Houses for rent
            </Link>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-slate-600">
               Houses for sale
            </h2>
            <Link
              to={'/search?type=sale'}
              className="text-sm text-blue-800 hover:underline"
            >
              Show more Houses for sale
            </Link>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
