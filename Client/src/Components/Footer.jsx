import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-500 text-white py-8 mt-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to='/'>
              <h1 className="font-bold text-xl flex gap-1">
                <span className="text-cyan-200">ELEVATE</span>
                <span className="text-cyan-400">ESTATES</span>
              </h1>
            </Link>
            <p className="text-gray-300 text-sm">
              Helping you find your dream home since 2010. Quality properties, trusted service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/rent" className="text-gray-300 hover:text-white transition">Rent</Link>
              </li>
              <li>
                <Link to="/buy" className="text-gray-300 hover:text-white transition">Buy</Link>
              </li>
              <li>
                <Link to="/create-listing" className="text-gray-300 hover:text-white transition">Sell</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li> Estate Avenue</li>
              <li> Elevate 10001</li>
              <li>Phone: (+254) 112-868-783</li>
              <li>Email: info@elevateestates.com</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Subscribe to get updates on new listings and market trends.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none text-gray-800"
              />
              <button className="bg-cyan-400 hover:bg-cyan-500 text-white px-4 py-2 rounded-r-lg transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-400 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>© {currentYear} Elevate Estates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;