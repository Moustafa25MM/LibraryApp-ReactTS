import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { ExploreTopBooks } from './layouts/HomePage/ExploreTopBooks';
import { Carousel } from './layouts/HomePage/Carousel';
import { LibraryServices } from './layouts/HomePage/LibraryServices';
import { Heros } from './layouts/HomePage/Heros';

function App() {
  return (
    <div>
      <Navbar />
      <ExploreTopBooks />
      <Carousel />
      <Heros />
      <LibraryServices />
      <Footer />
    </div>
  );
}

export default App;
