import { AiTwotoneDelete } from "react-icons/ai";
import "./index.css";

const BookmarkItem = (props) => {
  const { city, deleteBookmark, selectBookmark } = props;

  const deleteItem = () => {
    // console.log(city);
    deleteBookmark(city);
  };

  const bookmarkSelected = () => {
    // console.log(city);
    selectBookmark(city);
  };

  return (
    <li className="bookmark-item mb-3 ">
      <div className="d-flex justify-content-between">
        <h5 className="mb-1 bookmark-city mr-3" onClick={bookmarkSelected}>
          {city}
        </h5>
        <AiTwotoneDelete
          size="25"
          onClick={deleteItem}
          className="delete-icon"
        />
      </div>
    </li>
  );
};

export default BookmarkItem;
