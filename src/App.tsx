import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { ExploreTopBooks } from './layouts/HomePage/ExploreTopBooks';

function App() {
  return (
    <div>
      <Navbar />
      <ExploreTopBooks />
      <Footer />
    </div>
  );
}

export default App;
