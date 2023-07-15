import React from "react";

import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found__container">
      <h1 className="not-found__header">404</h1> <br />
      <div>Sorry, the page you are looking for doesn't exist</div>
    </div>
  );
};

export default NotFound;
