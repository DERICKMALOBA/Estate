import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SingIn';
import SignUp from './Pages/SingUp';
import About from './Pages/About';
import Profile from './Pages/Profile';
import Header from './Components/Header';
import PrivateRoute from './Components/PrivateRoute';
import CreateListing from './Pages/CreateListings';
import UpdateListing from './Pages/UpdateListing';
import Listing from './Pages/Listing';
import Search from './Pages/Search';
import Rent from './Pages/Rent';
import Buy from './Pages/Buy';
import ReviewForm from './Components/Review';
import Footer from './Components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-[calc(100vh-64px)]"> {/* Adjust this value based on your header height */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/about' element={<About />} />
          <Route path='/search' element={<Search />} />
          <Route path='/rent' element={<Rent />} />
          <Route path='/buy' element={<Buy />} />
          <Route path='/reviews' element={<ReviewForm />} />
          <Route path='/listing/:listingId' element={<Listing />} />

          <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-listing' element={<CreateListing />} />
            <Route
              path='/update-listing/:listingId'
              element={<UpdateListing />}
            />
          </Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}