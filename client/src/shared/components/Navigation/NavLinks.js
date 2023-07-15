import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact="true">
          HOME
        </NavLink>
      </li>
      <li>
          <NavLink to="/profiles" exact="true">Profiles</NavLink>
      </li>  
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth" exact="true">Login/Signup</NavLink>
        </li>
      )}   
      {auth.isLoggedIn && (
        <>
          <li>
            <NavLink to={"/profiles/" + auth.userId}>My Profile</NavLink>
          </li>
          <li>
            <NavLink to={"/my-posts"} exact="true">My Posts</NavLink>
          </li>
          <li>
            <NavLink to={"/newpost"} exact="true">New Post</NavLink>
          </li>
          <li className="logout-btn">
            <button onClick={auth.logout}>LOGOUT</button>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavLinks;
