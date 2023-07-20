import React from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";

import UserProfile from "./users/pages/Profile";
import AllProfiles from "./users/pages/AllProfiles";

// import Post from "./posts/pages/Post"

import NewPost from "./posts/pages/NewPost";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import NotFound from "./shared/components/UIElements/NotFound";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import "./App.css";
// import UpdateProfile from "./users/pages/UpdateProfile";
import AllPosts from "./posts/pages/AllPosts";
// import PostImages from "./posts/pages/PostImages";
// import UploadImage from "./posts/pages/UploadImage";
// import MyPost from "./posts/pages/MyPost";
// import UpdatePost from "./posts/pages/UpdatePost";
// import UserPost from "./posts/pages/UserPosts";

const App = () => {
  const { token, username, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        username: username,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <Routes>
          {/* 
          <Route path="/profiles/:userId/update" element={<UpdateProfile/>}/> */}
          <Route path="/profiles/:userId/" element={<UserProfile/>}/>
          <Route path="/" exact="true" element={<AllPosts />} />
          <Route path="/auth" exact="true" element={<Auth />} />
          <Route path="/newpost" element={<NewPost/>}/>
          <Route path="/profiles" exact="true" element={<AllProfiles/>}/>
          {/* 
          <Route path="posts/:postId" element={<Post/>}/> 
          <Route path="posts/:userId" element={<UserPost/>}/>
          <Route path="my-posts" exact="true" element={<MyPost/>}/>
          <Route path="posts/update/:postId" element={<UpdatePost/>}/>
          <Route path="posts/images/:id/new" element={<UploadImage/>}/>
          <Route path="posts/images/:id" element={<PostImages/>}/> 
          */}

          <Route path="*" exact="true" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
