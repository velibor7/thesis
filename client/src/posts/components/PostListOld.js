import React from "react";
import PostItemForList from "./PostItemForList";

const PostList = (props) => {
  return (
    <div className="posts">
      <div className="post-list__container">
      <h1>List of Posts</h1>
        <div className="post__wrapper">
          <div className="post-list__items">
            {props.items?.map((item) => (
              <PostItemForList item={item} key={item.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;