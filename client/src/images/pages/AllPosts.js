import React, { useState, useEffect, _ } from "react";
import PostList from "../components/PostList";
import { useParams } from 'react-router-dom' 

const AllPosts = () => {
  const [loadedPosts, setLoadedPosts] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        fetch(
          `http://localhost:5000/posts`,
          { method: "get", dataType: "json"}
        )
          .then((response) => response.json())
          .then((data) => {
            setLoadedPosts(data["posts"]);
          });
      } catch (err) {
        console.log("error happend")
        console.log(err);
      };
    };
    fetchPosts();
  }, []);

  return (
    <>
        <PostList items={loadedPosts}></PostList>
    </>
  );
};

export default AllPosts;
