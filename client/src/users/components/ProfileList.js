import ProfileItemForList from "./ProfileItemForList";
import React from "react";

import './ProfileList.css'

const ProfileList = (props) => {
  return (
    <div className="profiles">
      <h1>List of Profiles</h1>
      <div className="profile-list__container">
        <div className="profile__wrapper">
          <div className="profile-list__items">
            {props.items?.map((item) => (
              <ProfileItemForList item={item} key={item.id} currentUser={props.currentUser} currentUserFollowing={props.currentUserFollowing}/>
            ))}
          </div>
        </div>
      </div>
      <div>{props.currentUserFollowing}</div>
    </div>
  );
};

export default ProfileList;




