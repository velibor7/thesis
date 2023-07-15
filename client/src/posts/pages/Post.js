import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'  
import { useHttpClient } from "../../shared/hooks/http-hook";
import PostItem from '../components/PostItem';


const Post = () => {
  const {postId} = useParams();
  const [loadedPost, setLoadedPost] = useState({});

  const { sendRequest} = useHttpClient();

  
  useEffect(() => {
    const fetchPost = async () => {
        const resData = await sendRequest(
          `http://localhost:8000/posts/${postId}`,"GET",
        )
      console.log(resData)

      setLoadedPost(resData)
    };
    fetchPost();
  }, [postId, sendRequest]);

  return (
    <>
      <PostItem item={loadedPost}  key={postId}></PostItem>
    </>
  );
}

export default Post;