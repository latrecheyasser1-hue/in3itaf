import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ParticleNetwork from '../ui/ParticleNetwork';

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black-deep relative overflow-x-hidden">
      <ParticleNetwork />
      <Navbar />
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
