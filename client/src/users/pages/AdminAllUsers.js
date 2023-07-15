import React, { useState, useEffect } from "react";

import UserList from "../components/UserList";

const AdminAllUsers = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        fetch(
          "http://localhost:8001/api/authenticatedUser?is_active=true",
          {method: "get",
          dataType: 'json',}
        )
        .then(response => response.json())
        .then((data) => {
          var users = [];
          for(var i=0; i< data.length; i++){
            var user = data[i];
            console.log(user);
            users.push(user);
            
          }setLoadedUsers(users);
        })       
      } catch(err){console.log(err)};
    };
    fetchUsers();
  }, [setLoadedUsers]);

  return (
    <>
      <UserList items={loadedUsers}></UserList>
    </>
  );
};

export default AdminAllUsers;