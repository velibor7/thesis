import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import "./ProfileItem.css";

const ProfileItemForList = (props) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const follower_ids = props.item.follower_ids;
  const notFollowing = false;

  const FollowUser = async () => {
    try {
      navigate(`/profiles/${auth.userId}/update`);
    } catch (err) {
      navigate(`/profiles/${auth.userId}/update`);
      console.log(err);
    }
  };

  const UnfollowUser = async () => {
    try {
      navigate(`/profiles/${auth.userId}/update`);
    } catch (err) {
      navigate(`/profiles/${auth.userId}/update`);
      console.log(err);
    }
  };

  return (
    <>
      <div className="profile__item">
        <Link to={`/profiles/${props.item.id}`}>
          <h4 className="profile__item__firstName">{props.item.username}</h4>
        </Link>
        <div className="profile__item__info">
          <p className="profile__item__lastName">
            Last name: {props.item.lastName}
          </p>
          <p className="profile__item__gender">Email: {props.item.email}</p>
          <p className="profile__item__biography">Bio: {props.item.bio}</p>
          <p className="profile__item__biography">
            Posts: {props.item.post_count}
          </p>
          <p className="profile__item__biography">
            Follower: {props.item.follower_count}
          </p>
          <p className="profile__item__biography">
            Following: {props.item.following_count}
          </p>
        </div>
        <div className="profile-item__actions">
          {auth  ? //&& props?.currentUser.follower_ids.includes(props?.item.id) ? 
          (
            <Button info onClick={FollowUser}>
              Follow
            </Button>
          ) : (
            <Button danger onClick={UnfollowUser}>
              Unfollow
            </Button>
          )}
          <p></p>
        </div>
      </div>
    </>
  );
};

export default ProfileItemForList;
