import React, { useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useParams } from 'react-router-dom' 
import "./ProfileItem.css";
import Button from "../../shared/components/FormElements/Button";
import { useNavigate } from "react-router-dom";

const ProfileItem = (props) => {
  const id = useParams()['userId']
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  
  const UpdateProfile = async () => {
    try {
      navigate(`/profiles/${auth.userId}/update`);
    } catch (err) {
      navigate(`/profiles/${auth.userId}/update`);
      console.log(err);
    }
  };

  const AddPost = async () => {
    try {
      navigate(`/posts/${auth.userId}/new`);
    } catch (err) {
      navigate(`/posts/${auth.userId}/new`);
      console.log(err);
    }
  };

  const ViewPosts = async () => {
    try {
      navigate(`/posts/${props.item.profile?.id}`);
    } catch (err) {
      // navigate(`/posts/${auth.userId}`);
      console.log(err);
    }
  };

  return (
    <>
      <h1>Profile</h1>
      <div className="profile__item">
        <h3 className="profile__item__firstName">{props.item.fullName}</h3>
        <div className="profile__item__info">
          <p className="profile__item__email">
            Full Name: {props.item?.full_name}
          </p>
          <p className="profile__item__email">
            username: {props.item?.username}
          </p>
          <p className="profile__item__email">
            email: {props.item?.email}
          </p>
          <p className="profile__item__email">
            bio: {props.item?.bio}
          </p>
          <p className="profile__item__email">
            post count: {props.item?.post_count}
          </p>
          <p className="profile__item__email">
            followers: {props.item?.follower_count}
          </p>
          <p className="profile__item__email">
            following: {props.item?.following_count}
          </p>
          
        </div>
        <div className="profile-item__actions">
          {
            (auth.userId === id) &&
            (<Button info onClick={UpdateProfile}>
              Update
            </Button>)
          }
          {/* {
            (auth.userId === id) &&
            (<Button info onClick={AddPost}>
              New Post
            </Button>
            )
          } */}
          <p></p>
          {
            (auth.userId !== id) &&(
            <Button info onClick={ViewPosts}>
              User Posts
            </Button>
            )
          }
        </div>
      </div>
    </>
  );
};

export default ProfileItem;
