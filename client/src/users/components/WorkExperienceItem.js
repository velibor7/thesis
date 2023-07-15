import { Link } from "react-router-dom";

import React, { useContext } from "react";


const WorkExperienceItem = (props) => {

  return (
    <>
      <div className="work_experience__item">
        <div className="work_experience__item__info">
          <p className="work_experience__item__title">
            Title: {props.item.title}
          </p>
          <p className="work_experience__item__company">
            Company: {props.item.company}
          </p>
          <p className="work_experience__item__employmentType">
            Employment type: {props.item.employmentType}
          </p>
        </div>
      </div>
      <hr></hr>
    </>
  );
};

export default WorkExperienceItem;
