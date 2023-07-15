import React, { useState, useEffect, useContext } from "react";
import PostList from "../components/PostList";
import { AuthContext } from "../../shared/context/auth-context";

const MyPost = () => {
  const [loadedPosts, setLoadedPosts] = useState();
  
  const auth = useContext(AuthContext);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        fetch(
          `http://localhost:8000/posts/profile/${auth.userId}`,
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
  }, [auth]);

  return (
    <>
        <PostList items={loadedPosts}></PostList>
    </>
  );
};

export default MyPost