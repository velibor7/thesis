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
        <h3 className="profile__item__firstName">{props.item.profile?.username}</h3>
        <div className="profile__item__info">
          <p className="profile__item__firstName">
            First name: {props.item.profile?.firstName}
          </p>
          <p className="profile__item__lastName">
            Last name: {props.item.profile?.lastName}
          </p>
          <p className="profile__item__phoneNumber">
            Phone number: {props.item.profile?.phoneNumber}
          </p>
          <p className="profile__item__email">
            Email: {props.item.profile?.email}
          </p>
          
        </div>
        <div className="cocktail-item__actions">
          {
            (auth.userId === id) &&
            (<Button info onClick={UpdateProfile}>
              Update
            </Button>)
          }
          {
            (auth.userId === id) &&
            (<Button info onClick={AddPost}>
              New Post
            </Button>
            )
          }
          <p></p>
          {
            (auth.userId !== id) &&(
            <Button info onClick={ViewPosts}>
              Users Posts
            </Button>
            )
          }
        </div>
      </div>
    </>
  );
};

export default ProfileItem;
