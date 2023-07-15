import PostItem from "./PostItemForList";
import React from "react";

const PostList = (props) => {
  return (
    <div className="posts">
      <div className="post-list__container">
      <h1>List of Posts</h1>
        <div className="post__wrapper">
          <div className="post-list__items">
            {props.items?.map((item) => (
              <PostItem item={item} key={item.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;