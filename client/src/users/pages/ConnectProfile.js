import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

const MakeAdmin = () => {
    const auth = useContext(AuthContext);
    const {sendRequest} = useHttpClient();
    const [loadedUser, setLoadedUser] = useState({});
    const navigate = useNavigate();
    const {userId} =  useParams();
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const resData = await sendRequest(
            `http://localhost:8001/api/authenticatedUser/${userId}`
          );
          console.log(resData);
          setLoadedUser(resData);
        } catch (err) {console.log(err)}
      };
      fetchUser();
    }, [sendRequest, userId]);
  
    const userUpdateSubmitHandler = async (event) => {
      event.preventDefault()
      
      try {

        await sendRequest(
          `http://localhost:8001/api/authenticatedUser/${userId}/makeAdmin`,
          "POST",
          {},
          {
            Authorization: "token " + auth.token,
          }
        );
        navigate("/");
      } catch (err) {console.log(err)}
    };
    return (
    <>
      <div className="user__item">
        <div className="user__item__info">
          <p className="user__item__name">Firstname: <b>{loadedUser.first_name}</b></p>
          <p className="user__item__city">Lastname: <b>{loadedUser.last_name}</b></p>
          <p className="user__item__street">Phone number: <b>{loadedUser.phone_number}</b></p>
          <p className="user__item__city">Email: <b>{loadedUser.email}</b></p>
          <p className="user__item__street">Country: <b>{loadedUser.country}</b></p>
          <p className="user__item__city">City: <b>{loadedUser.city}</b></p>
          <p className="user__item__street">Street: <b>{loadedUser.street}</b></p>
          <p className="user__item__city">Loyalty points: <b>{loadedUser.loyalty_points}</b></p>
          <p className="user__item__street">UserType: <b>{loadedUser.type}</b></p>
        </div>
        <Button  onClick ={userUpdateSubmitHandler}>
          Make admin
        </Button>
      </div>
    </>
  )
}

export default MakeAdmin