import ProfileItem from "./ProfileItemForList";
import React from "react";

const ProfileList = (props) => {
  return (
    <div className="profiles">
      <h1>List of Profiles</h1>
      <div className="profile-list__container">
        <div className="profile__wrapper">
          <div className="profile-list__items">
            {props.items?.map((item) => (
              <ProfileItem item={item} key={item.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileList;




