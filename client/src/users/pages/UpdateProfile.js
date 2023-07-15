import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'  
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import User from '../components/ProfileItem';
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";



const UpdateProfile = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest} = useHttpClient();
  const navigate = useNavigate();
  // const userId =  auth.id;
  const [formState, inputHandler, setFormData] = useForm({});

  const [loadedUser, setLoadedUser] = useState();

  
  useEffect(() => {
    const fetchProfile = async () => {
        const resData = await sendRequest(
          `http://localhost:8000/profiles/${auth.userId}`,"GET",
        );
     
      setLoadedUser(resData["profile"]);
      // console.log(resData["profile"])
    };
    fetchProfile();
  }, [auth, sendRequest, setFormData]);
  const UpdateSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      var body = {
        id: auth.userId,
        username: formState.inputs.uname.value,
        firstName: formState.inputs.fname.value,
        lastName: formState.inputs.lname.value,
        phoneNumber: formState.inputs.phone.value,
        email: formState.inputs.email.value,
      };
      console.log(auth.userId)
      await sendRequest(
        `http://localhost:8000/profiles/${auth.userId}`,
        "PUT",
        JSON.stringify(body),
        {
          "Content-Type": "application/json",
          Authorization: "token " + auth.token,
        }
      );
      navigate("/profiles");
      console.log(JSON.stringify(body));
    } catch (err) {
      console.log(JSON.stringify(body));
      console.log(err);
    }
  };

  return (
    <div style={{ marginTop: "4em" }}>
      <Card>
        {!isLoading && loadedUser && (
          <form className="user-form" onSubmit={UpdateSubmitHandler}>
            <Input
              id="uname"
              element="input"
              type="text"
              label="Username"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="plase enter a valid username"
              onInput={inputHandler}
              initialValue={loadedUser.username}
              initialValid={true}
            />
            <Input
              id="fname"
              element="input"
              type="text"
              label="First name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="plase enter a valid first name"
              onInput={inputHandler}
              initialValue={loadedUser.firstName}
              initialValid={true}
            />
            <Input
              id="lname"
              element="input"
              type="text"
              label="Last name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="plase enter a valid last name"
              onInput={inputHandler}
              initialValue={loadedUser.lastName}
              initialValid={true}
            />
            <Input
              id="phone"
              element="input"
              type="number"
              label="Phone number"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="plase enter a valid phone number"
              onInput={inputHandler}
              initialValue={loadedUser.phoneNumber}
              initialValid={true}
            />
            <Input
              id="email"
              element="input"
              type="text"
              label="Email"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="plase enter a valid email"
              onInput={inputHandler}
              initialValue={loadedUser.email}
              initialValid={true}
            />
            <Button type="submit">
              SUBMIT
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default UpdateProfile;