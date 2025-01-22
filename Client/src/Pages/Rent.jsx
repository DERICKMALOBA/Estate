import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ListingItem from '../Components/ListingItem';

export default function Rent() {
  const [rentListings, setRentListings] = useState([]);

  // Fetch Rent Listings
  const fetchRentListings = async () => {
    try {
      const res = await fetch('/api/listing/get?type=rent&limit=4');
      const data = await res.json();
      setRentListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRentListings();
  }, []);

  return (
    <div>
      {rentListings && rentListings.length > 0 && (
        <div className=''>
         <div className='my-3 flex flex-col items-center justify-center'>
  <h2 className='text-2xl font-semibold text-slate-600 text-center'>Rent a House with Ease</h2>
  <Link className='text-sm text-blue-800 hover:underline text-center' to={'/search?type=rent'}>
    Show more Houses for Rent
  </Link>
</div>

          <div className='flex flex-wrap gap-4'>
            {rentListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
