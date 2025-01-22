import { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch all users and listings from backend
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    fetch('/api/listings')
      .then(response => response.json())
      .then(data => setListings(data))
      .catch(error => console.error('Error fetching listings:', error));
  }, []);

  const handleDeleteUser = (userId) => {
    fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        // Remove user from local state after deletion
        setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => console.error('Error deleting user:', error));
  };

  const handleDeleteListing = (listingId) => {
    fetch(`/api/listings/${listingId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(() => {
        // Remove listing from local state after deletion
        setListings(listings.filter(listing => listing.id !== listingId));
      })
      .catch(error => console.error('Error deleting listing:', error));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Users Management */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Listings Management */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Manage Listings</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map(listing => (
              <tr key={listing.id}>
                <td className="p-2 border">{listing.title}</td>
                <td className="p-2 border">{listing.price}</td>
                <td className="p-2 border">{listing.location}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDeleteListing(listing.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
