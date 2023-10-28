/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import BookModel from '../models/BookModel';
import { SpinnerLoading } from '../layouts/utils/SpinnerLoading';
import { StarsReview } from '../layouts/utils/StarsReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';
import ReviewModel from '../models/ReviewModel';
import { LatestReviews } from './LatestReviews';
import { useOktaAuth } from '@okta/okta-react';
import ReviewRequestModel from '../models/ReviewRequestModel';
import { error } from 'console';

export const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStarts, setTotalStars] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadinUserReview] = useState(true);

  // Loans Count State
  const [currentloansCount, setCurrentloansCount] = useState(0);
  const [isLoadingCurrentloansCount, setIsLoadingCurrentloansCount] =
    useState(true);

  // Is Book Check Out ?
  const [isCheckOut, setIsCheckOut] = useState(false);
  const [isLoadingBookCheckOut, setIsLoadingBookCheckOut] = useState(true);

  // Payment
  const [displayError, setDisplayError] = useState(false);
  const bookId = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `${process.env.REACT_APP_API}/books/${bookId}`;

      const response = await fetch(baseUrl);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const responseJson = await response.json();

      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };
      setBook(loadedBook);
      setIsLoading(false);
    };
    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    window.scrollTo(0, 0);
  }, [isCheckOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
      const responseReviews = await fetch(reviewUrl);
      if (!responseReviews.ok) {
        throw new Error('Something went wrong!');
      }
      const responseReviewsJson = await responseReviews.json();
      const responseReviewsData = responseReviewsJson._embedded.reviews;
      const loadedReviews: ReviewModel[] = [];

      let weightedStarReviews: number = 0;

      for (const key in responseReviewsData) {
        loadedReviews.push({
          id: responseReviewsData[key].id,
          userEmail: responseReviewsData[key].userEmail,
          date: responseReviewsData[key].date,
          rating: responseReviewsData[key].rating,
          book_id: responseReviewsData[key].book_id,
          reviewDescription: responseReviewsData[key].reviewDescription,
        });
        weightedStarReviews =
          weightedStarReviews + responseReviewsData[key].rating;
      }
      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }
      setReviews(loadedReviews);
      setIsLoadingReviews(false);
    };
    fetchBookReviews().catch((error: any) => {
      setIsLoadingReviews(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };
        const userReview = await fetch(url, requestOptions);
        if (!userReview.ok) {
          throw new Error('something went wrong!');
        }
        const userReviewResponseData = await userReview.json();
        setIsReviewLeft(userReviewResponseData);
        console.log(userReviewResponseData);
      }
      setIsLoadinUserReview(false);
    };
    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingReviews(false);
      setHttpError(error.message);
    });
  }, [authState]);

  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error('something went wrong!');
        }
        const currentLoansCountResponseJson =
          await currentLoansCountResponse.json();
        setCurrentloansCount(currentLoansCountResponseJson);
      }
      setIsLoadingCurrentloansCount(false);
    };
    fetchUserCurrentLoansCount().catch((err: any) => {
      setIsLoadingCurrentloansCount(false);
      setHttpError(err.message);
    });
  }, [authState, isCheckOut]);

  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            'Content-Type': 'application/json',
          },
        };
        const currentCheckedOutBookResponse = await fetch(url, requestOptions);
        if (!currentCheckedOutBookResponse.ok) {
          throw new Error('something went wrong!');
        }
        const currentCheckedOutBookResponseJson =
          await currentCheckedOutBookResponse.json();
        setIsCheckOut(currentCheckedOutBookResponseJson);
      }
      setIsLoadingBookCheckOut(false);
    };
    fetchUserCheckedOutBook().catch((err: any) => {
      setIsLoadingBookCheckOut(false);
      setHttpError(err.message);
    });
  }, [authState]);

  if (
    isLoading ||
    isLoadingReviews ||
    isLoadingCurrentloansCount ||
    isLoadingBookCheckOut ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className='container m-5'>
        <p>{httpError}</p>
      </div>
    );
  }

  async function checkOutBook() {
    const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${book?.id}`;
    const requestOptions = {
      method: 'Put',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      setDisplayError(true);
      throw new Error('something went wrong!');
    }
    setDisplayError(false);
    setIsCheckOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }
    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );
    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewRequestModel),
    };
    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error('something went wrong!');
    }
    setIsReviewLeft(true);
  }
  return (
    <div>
      <div className='container d-none d-lg-block'>
        {displayError && (
          <div className='alert alert-danger mt-3 ' role='alert'>
            Please Pay Outstanding fees and/or return late book(s).
          </div>
        )}
        <div className='row mt-5'>
          <div className='col-sm-2 col-md-2'>
            {book?.img ? (
              <img src={book?.img} width='226' height='349' alt='Book' />
            ) : (
              <img
                src={require('../Images/BooksImages/book-luv2code-1000.png')}
                width='226'
                height='349'
                alt='Book'
              />
            )}
          </div>
          <div className='col-4 col-md-4 container'>
            <div className='ml-2'>
              <h2>{book?.title}</h2>
              <h5 className='text-primary'>{book?.author}</h5>
              <p className='lead'>{book?.description}</p>
              <StarsReview rating={totalStarts} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansCount={currentloansCount}
            isAuthenicated={authState?.isAuthenticated}
            isCheckedOut={isCheckOut}
            checkOutBook={checkOutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>
      <div className='container d-lg-none mt-5'>
        <div className='d-flex justify-content-center align-items-center'>
          {book?.img ? (
            <img src={book?.img} width='226' height='349' alt='Book' />
          ) : (
            <img
              src={require('../Images/BooksImages/book-luv2code-1000.png')}
              width='226'
              height='349'
              alt='Book'
            />
          )}
        </div>
        <div className='mt-4'>
          <div className='ml-2'>
            <h2>{book?.title}</h2>
            <h5 className='text-primary'>{book?.author}</h5>
            <p className='lead'>{book?.description}</p>
            <StarsReview rating={3.5} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentloansCount}
          isAuthenicated={authState?.isAuthenticated}
          isCheckedOut={isCheckOut}
          checkOutBook={checkOutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />

        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
