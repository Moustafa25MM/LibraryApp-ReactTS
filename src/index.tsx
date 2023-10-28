import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51O65spEEOAA8lEpOaboToVr7XVwUOmVx4P1SsqUSFE5fBEqHm3bfMTUkiFS7fZ8pj3zaxuJV6xJcCFRhXkgNUjnq00gneNZtWr'
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>
);
