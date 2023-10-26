class ReviewRequestModel {
  rating?: number;
  bookId?: number;
  reviewDescription?: string;

  constructor(rating: number, bookId: number, reviewDescription: string) {
    this.bookId = bookId;
    this.rating = rating;
    this.reviewDescription = reviewDescription;
  }
}

export default ReviewRequestModel;
