import React from "react";

import PostItem from "./PostItem";
import "./PostList.css";

const PostList = (props) => {
  return (
    <ul className="post-list">
      {props.items?.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          image_url={post.image_url}
          content={post.content}
          user_id={post.user_id}
        />
      ))}
    </ul>
  );
};

export default PostList;