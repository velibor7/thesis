import "./PostItem.css";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import Button from "../../shared/components/FormElements/Button";


const PostItemForList = (props) => {
  
  const auth = useContext(AuthContext);
  return (
    <>
      <div className="post__item">
        <Link to={`/posts/images/${props.item.id}`}>
          <h4 className="profile__item__firstName">{props.item.title}</h4>
        </Link>
        <div className="post__item__info">
          <p className="post__item__text">
            {props.item.content}
          </p>
          <p className="post__item__created">
            Created: {props.item.created.slice(0,10)}
          </p>
          <p className="post__item__created">
            Price: {props.item.price}$
          </p>
        </div>
        {(auth.userId === props.item.userId) && (
        <Button reverse to={`/posts/update/${props.item?.id}`}>
          Update
        </Button>
        )}
      </div>
    </>
  );
};

export default PostItemForList;
