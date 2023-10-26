import { Link } from 'react-router-dom';
import BookModel from '../models/BookModel';
import { LeaveAReview } from '../layouts/utils/LeaveReview';

export const CheckoutAndReviewBox: React.FC<{
  book: BookModel | undefined;
  mobile: boolean;
  currentLoansCount: number;
  isAuthenicated: any;
  isCheckedOut: boolean;
  checkOutBook: any;
  isReviewLeft: Boolean;
}> = (props) => {
  function reviewRender() {
    if (props.isAuthenicated && !props.isReviewLeft) {
      return (
        <p>
          <LeaveAReview />
        </p>
      );
    } else {
      if (props.isAuthenicated && props.isReviewLeft) {
        return (
          <p>
            <b>Thanks For Your Review</b>
          </p>
        );
      }
    }
    return (
      <div>
        <hr>
          <p>Sign in to be able to leave a review.</p>
        </hr>
      </div>
    );
  }
  function buttonRender() {
    if (props.isAuthenicated) {
      if (!props.isCheckedOut && props.currentLoansCount < 5) {
        return (
          <button
            onClick={() => props.checkOutBook()}
            className='btn btn-success btn-lg'
          >
            Checkout
          </button>
        );
      } else if (props.isCheckedOut) {
        return (
          <p>
            <b>Book Checked Out. Enjoy!</b>
          </p>
        );
      } else if (!props.isCheckedOut) {
        return <p className='text-danger'>Too Many Books Checked Out.</p>;
      }
    }
    return (
      <Link to={'/login'} className='btn btn-success btn-lg'>
        Sign In{' '}
      </Link>
    );
  }
  return (
    <div
      className={
        props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'
      }
    >
      <div className='card-body container'>
        <div className='mt-3'>
          <p>
            <b>{props.currentLoansCount}/5 </b>
            books checked out
          </p>
          <hr />
          {props.book &&
          props.book.copiesAvailable &&
          props.book.copiesAvailable > 0 ? (
            <h4 className='text-success'>Available</h4>
          ) : (
            <h4 className='text-danger'>Wait List</h4>
          )}
          <div className='row'>
            <p className='col-6 lead'>
              <b>{props.book?.copies} </b>
              copies
            </p>
            <p className='col-6 lead'>
              <b>{props.book?.copiesAvailable} </b>
              available
            </p>
          </div>
        </div>
        {buttonRender()}
        <hr />
        <p className='mt-3'>
          This number can change until placing order has been complete.
        </p>
        {reviewRender()}
      </div>
    </div>
  );
};
