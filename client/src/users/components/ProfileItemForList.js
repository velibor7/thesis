import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";
import "./ProfileItem.css";

const ProfileItemForList = (props) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  // const follower_ids = props.item.follower_ids;
  const [followingIds, setFollowingIds] = useState([]);
  const notFollowing = false;

  useEffect(() => {
    setFollowingIds(props?.currentUserFollowing);
  }, []);

  const followUser = async (user_to_follow) => {
    if (!auth.userId) {
      console.error("you are not logged in");
    } else {
      console.log(auth.userId + " wants to follow: " + user_to_follow);
      try {
        fetch(
          `http://localhost:8000/users/${auth.userId}/${user_to_follow}/follow`,
          {
            method: "post",
            dataType: "json",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // todo: set following ids to include this one
            var helper = followingIds.push(user_to_follow);
            setFollowingIds(helper);
          });
      } catch (err) {
        console.log("error happend");
        console.log(err);
      }
    }
  };

  const unfollowUser = async (user_to_unfollow) => {
    if (!auth.userId) {
      console.error("you are not logged in");
    } else {
      console.log(auth.userId + " wants to unfollow: " + user_to_unfollow);
      try {
        fetch(
          `http://localhost:8000/users/${auth.userId}/${user_to_unfollow}/unfollow`,
          {
            method: "post",
            dataType: "json",
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            var helper = followingIds;
            const indexToRemove = helper.indexOf(user_to_unfollow);
            helper.splice(indexToRemove, 1);
            setFollowingIds(helper);
            console.log("followingIds " + followingIds);
          });
      } catch (err) {
        console.log("error happend");
        console.log(err);
      }
    }
  };

  return (
    <>
      <div className="profile__item">
        <Link to={`/profiles/${props?.item.id}`}>
          <h4 className="profile__item__firstName">{props?.item.username}</h4>
        </Link>
        <div className="profile__item__info">
          <p className="profile__item__lastName">
            Last name: {props?.item.lastName}
          </p>
          <p className="profile__item__gender">Email: {props?.item.email}</p>
          <p className="profile__item__biography">Bio: {props?.item.bio}</p>
          <p className="profile__item__biography">
            Posts: {props?.item.post_count}
          </p>
          <p className="profile__item__biography">
            Follower: {props?.item.follower_count}
          </p>
          <p className="profile__item__biography">
            Following: {props?.item.following_count}
          </p>
        </div>
        {auth.userId && (
          <div className="profile-item__actions">
            {/* {!followingIds.includes(props?.item.id) ? ( */}
            {!props?.currentUserFollowing.includes(props?.item.id) ? (
              <Button info onClick={() => followUser(props?.item.id)}>
                Follow
              </Button>
            ) : (
              <Button danger onClick={() => unfollowUser(props?.item.id)}>
                Unfollow
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileItemForList;
