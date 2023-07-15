import { Link } from "react-router-dom";

import React, { useContext } from "react";


const EducationItem = (props) => {

  return (
    <>
      <div className="education__item">
        <div className="education__item__info">
          <p className="education__item__school">
            School: {props.item.school}
          </p>
          <p className="education__item__degree">
            Degree: {props.item.degree}
          </p>
          <p className="education__item__fieldOfStudy">
            Field of study: {props.item.fieldOfStudy}
          </p>
          <p className="education__item__description">
            Description: {props.item.description}
          </p>
        </div>
      </div>
      <hr></hr>
    </>
  );
};

export default EducationItem;
