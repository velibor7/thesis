import React, { useContext, useState, useEffect } from "react";
import ProfileList from "../components/ProfileList";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

const AllProfiles = () => {
  const auth = useContext(AuthContext);
  const [loadedProfiles, setLoadedProfiles] = useState();
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserFollowing, setCurrentUserFollowing] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        fetch(`http://localhost:8000/users`, {
          method: "get",
          dataType: "json",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            var profiles = [];
            for (var i = 0; i < data.length; i++) {
              var profile = data[i];
              if (profile.id == auth.userId) {
                continue;
              }
              profiles.push(profile);
            }
            setLoadedProfiles(profiles);
            // setLoadedProfiles(data);
            // console.log(loadedProfiles)
          });
      } catch (err) {
        console.log("error happend");
        console.log(err);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    const fetchSingleUserInfo = async () => {
      try {
        fetch(`http://localhost:8000/users/${auth.userId}`, {
          method: "get",
          dataType: "json",
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCurrentUser(data);
            setCurrentUserFollowing(data.following_ids);
            console.log("currentUserFollowing: " + currentUserFollowing)
          });
      } catch (err) {
        console.log("error happend");
        console.log(err);
      }
    };
    fetchSingleUserInfo();
  }, []);

  return (
    <>
      <ProfileList items={loadedProfiles} currentUser={currentUser} currentUserFollowing={currentUserFollowing}/>
    </>
  );
};

export default AllProfiles;
