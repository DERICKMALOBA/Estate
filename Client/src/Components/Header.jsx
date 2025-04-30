import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchClick = () => {
    const urlParams = new URLSearchParams();
    if (searchTerm) urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-gray-500 sticky top-0 z-10 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 gap-10">
        {/* Logo Section - Left */}
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex gap-2">
            <span className="text-cyan-200">ELEVATE</span>
            <span className="text-cyan-400">ESTATES</span>
          </h1>
        </Link>

        {/* Search Input - Center */}
        <div className="bg-slate-300 p-4 rounded-2xl flex items-center w-full max-w-md mx-auto">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search a home..." 
              className="bg-transparent focus:outline-none w-full sm:w-64 pl-4 pr-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              onKeyDown={handleKeyPress}  // Trigger search on Enter key press
            />
            <FaSearch 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-2xl cursor-pointer"
              onClick={handleSearchClick} 
            />
          </div>
        </div>

        {/* Links Section - Right */}
        <ul className="flex gap-4">
          <li className="hover:opacity-70 active:text-blue-500 transition duration-200">
            <Link to='/'>Home</Link>
          </li>
          <li className="hover:opacity-70 active:text-blue-500 transition duration-200">
            <Link to='/rent'>Rent</Link>
          </li>
          <li className="hover:opacity-70 active:text-blue-500 transition duration-200">
            <Link to='/buy'>Buy</Link>
          </li>
          <li className="hover:opacity-70 active:text-blue-500 transition duration-200">
            <Link to='/create-listing'>Sell</Link>
          </li>
          <li className="hover:opacity-70 active:text-blue-500 transition duration-200">
            <Link to='/profile'>
              {currentUser ? (
                <img
                  className='rounded-full h-7 w-7 object-cover'
                  src={currentUser.avatar}
                  alt='PROFILE'
                />
              ) : (
                <span className='text-slate-700 hover:underline'>Sign in</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
