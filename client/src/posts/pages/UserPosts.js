import React, { useState, useEffect} from "react";
import PostList from "../components/PostList";
import { useParams } from "react-router-dom";

const UserPost = () => {
  const [loadedPosts, setLoadedPosts] = useState();
  
  const {userId} = useParams();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        fetch(
          `http://localhost:8000/posts/profile/${userId}`,
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
  }, [userId]);

  return (
    <>
        <PostList items={loadedPosts}></PostList>
    </>
  );
};

export default UserPost