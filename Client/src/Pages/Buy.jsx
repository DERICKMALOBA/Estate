import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ListingItem from '../Components/ListingItem';

export default function Buy() {
  const [saleListings, setSaleListings] = useState([]);

  // Fetch Sale Listings
  const fetchSaleListings = async () => {
    try {
      const res = await fetch('/api/listing/get?type=sale&limit=4');
      const data = await res.json();
      setSaleListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSaleListings();
  }, []);

  return (
    <div>
      {saleListings && saleListings.length > 0 && (
        <div className=''>
          <div className='my-3 flex flex-col items-center justify-center'>
  <h2 className='text-2xl font-semibold text-slate-600 text-center'>Buy  a House with Ease</h2>
  <Link className='text-sm text-blue-800 hover:underline text-center' to={'/search?type=rent'}>
    Show more Houses for Sale
  </Link>
</div>

          <div className='flex flex-wrap gap-4'>
            {saleListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
