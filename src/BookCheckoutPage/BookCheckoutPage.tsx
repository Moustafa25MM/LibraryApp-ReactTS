import { useEffect, useState } from 'react';
import BookModel from '../models/BookModel';
import { SpinnerLoading } from '../layouts/utils/SpinnerLoading';
import { StarsReview } from '../layouts/utils/StarsReview';
import { CheckoutAndReviewBox } from './CheckoutAndReviewBox';
import ReviewModel from '../models/ReviewModel';
import { LatestReviews } from './LatestReviews';
import { useOktaAuth } from '@okta/okta-react';

export const BookCheckoutPage = () => {
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStarts, setTotalStars] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Loans Count State
  const [currentloansCount, setCurrentloansCount] = useState(0);
  const [isLoadingCurrentloansCount, setIsLoadingCurrentloansCount] =
    useState(true);

  const bookId = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchBooks = async () => {
      const baseUrl: string = `http://localhost:8000/api/books/${bookId}`;

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
  }, [bookId]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const reviewUrl: string = `http://localhost:8000/api/reviews/search/findByBookId?bookId=${bookId}`;
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
  }, []);

  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `http://localhost:8000/api/books/secure/currentloans/count`;
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
  }, [authState]);

  if (isLoading || isLoadingReviews || isLoadingCurrentloansCount) {
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
    <div>
      <div className='container d-none d-lg-block'>
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
        />

        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
