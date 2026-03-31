import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import LuxuryIcon from '../ui/GoldenOrbitIcon';
import { useSettings } from '../../context/SettingsContext';

const Navbar: React.FC = () => {
  const { settings } = useSettings();
  const { wishlist } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المعرض', path: '/gallery' },
    { name: 'الكتاب', path: '/book' },
    { name: 'المتجر', path: '/shop' },
    { name: 'من نحن', path: '/about' },
    { name: 'تواصل معنا', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black-deep/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
        {/* Toggle Button for Mobile */}
        <button className="lg:hidden text-ivory hover:text-gold transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-gold tracking-widest font-serif relative group">
          {settings.site_title || 'انعطاف'}
          <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex space-x-10 space-x-reverse">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-lg font-medium transition-colors hover:text-gold relative group ${location.pathname === link.path ? 'text-gold' : 'text-ivory'}`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-gold transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </nav>

        {/* Icons with Luxury Icon Effect */}
        <div className="flex space-x-4 space-x-reverse text-ivory">
          <Link to="/wishlist" className="relative group">
            <LuxuryIcon>
              <Heart size={24} className={`transition-colors duration-300 ${wishlist.length > 0 ? "fill-gold text-gold" : "group-hover:text-gold hover:text-gold"}`} />
            </LuxuryIcon>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-burgundy text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-sans z-20">
                {wishlist.length}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-black-card border-b border-white/5 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[400px] py-4' : 'max-h-0'}`}>
        <nav className="flex flex-col items-center space-y-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xl ${location.pathname === link.path ? 'text-gold' : 'text-ivory'} hover:text-gold transition-colors`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
