import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Book from './pages/Book';
import Shop from './pages/Shop';
import Order from './pages/Order';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Wishlist from './pages/Wishlist';

import { useEffect } from 'react';

// A wrapper to use useLocation inside Router
function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="book" element={<Book />} />
          <Route path="shop" element={<Shop />} />
          <Route path="order/:productId" element={<Order />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
        {/* Dashboard has its own layout or just a password protector */}
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <WishlistProvider>
        <Router>
          <AnimatedRoutes />
        </Router>
      </WishlistProvider>
    </SettingsProvider>
  );
}

export default App;
