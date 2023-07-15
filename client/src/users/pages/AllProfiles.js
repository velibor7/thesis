import React, { useState, useEffect, _ } from "react";
import ProfileList from "../components/ProfileList";

const AllProfiles = () => {
  const [loadedProfiles, setLoadedProfiles] = useState();


  useEffect(() => {
    const fetchProfiles = async () => {

      try {
        fetch(
          `http://localhost:8000/profiles`,
          { method: "get", dataType: "json"}
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            var profiles = [];
            data = data['profile']
            for (var i = 0; i < data.length; i++) {
              var profile = data[i];
              profiles.push(profile);
            }
            setLoadedProfiles(profiles);
          });
      } catch (err) {
        console.log("error happend")
        console.log(err);
      };
    };
    fetchProfiles();
  }, []);

  return (
    <>
        <ProfileList items={loadedProfiles}></ProfileList>
    </>
  );
};

export default AllProfiles;
