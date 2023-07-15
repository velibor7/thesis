import React, { useState, useEffect, _ } from "react";
import PostList from "../components/PostList";
import { useParams } from 'react-router-dom' 

const AllPosts = () => {
  const [loadedPosts, setLoadedPosts] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        fetch(
          `http://localhost:8000/posts`,
          { method: "get", dataType: "json"}
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            setLoadedPosts(data);
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
        <PostList items={loadedPosts} />
    </>
  );
};

export default AllPosts;
