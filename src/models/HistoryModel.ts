class HistoryModel {
  id: number;
  userEmail: string;
  checkoutDate: string;
  returendDated: string;
  title: string;
  author: string;
  description: string;
  img: string;

  constructor(
    id: number,
    userEmail: string,
    checkoutDate: string,
    returendDated: string,
    title: string,
    author: string,
    description: string,
    img: string
  ) {
    this.id = id;
    this.userEmail = userEmail;
    this.checkoutDate = checkoutDate;
    this.returendDated = returendDated;
    this.title = title;
    this.author = author;
    this.description = description;
    this.img = img;
  }
}

export default HistoryModel;
