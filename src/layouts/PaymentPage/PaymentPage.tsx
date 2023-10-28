import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import { SpinnerLoading } from '../utils/SpinnerLoading';
import { CardElement } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';

export const PaymentPage = () => {
  const { authState } = useOktaAuth();
  const [httpError, setHttpError] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [fees, setFees] = useState(0);
  const [loadingFees, setLoadingFeses] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8000/api/payments/searc/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const paymentResponse = await fetch(url, requestOptions);
        if (!paymentResponse.ok) {
          throw new Error('Something went wrong.');
        }
        const paymentResponseJson = await paymentResponse.json();
        setFees(paymentResponseJson.amount);
        setLoadingFeses(false);
      }
    };
    fetchFees().catch((error: any) => {
      setLoadingFeses(false);
      setHttpError(error.message);
    });
  }, [authState]);
  if (loadingFees) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className='container m-5'>
        <p>{httpError}</p>
      </div>
    );
  }
  return (
    <div className='container'>
      {fees > 0 && (
        <div className='card mt-3'>
          <h5 className='card-header'>
            Fees Pending : <span className='text-danger'>${fees}</span>
          </h5>
          <div className='card-body'>
            <h5 className='card-title mb-3'>Credit Card</h5>
            <CardElement id='card-element' />
            <button
              disabled={submitDisabled}
              type='button'
              className='btn btn-md main-color text-white mt-3'
            >
              Pay Fees
            </button>
          </div>
        </div>
      )}
      {fees === 0 && (
        <div className='mt-3'>
          <h5>You have no Fees</h5>
          <Link
            type='button'
            className='btn main-color text-white'
            to={'/search'}
          >
            Explore Top Books
          </Link>
        </div>
      )}
      {submitDisabled && <SpinnerLoading />}
    </div>
  );
};
