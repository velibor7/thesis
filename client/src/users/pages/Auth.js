import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Spinner from "../../shared/components/UIElements/Spinner";

import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const navigate = useNavigate();

  const [formState, inputHandler, setFormData] = useForm(
    {
      username: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:8000/login",
          // "http://localhost:8000/token",
          "POST",
          JSON.stringify({
            username: formState.inputs.username.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        console.log("responseData: " + responseData);

        auth.login(responseData.userId, responseData.token);
        navigate("/");

        if (auth.isLoggedIn) {
          navigate("/");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log(formState.isValid)
      try {
        const responseData = await sendRequest(
          "http://localhost:8000/register",
          "POST",
          JSON.stringify({
            username: formState.inputs.username.value,
            password: formState.inputs.password.value,
            full_name: formState.inputs.full_name.value,
            bio: formState.inputs.bio.value,
            email: formState.inputs.email.value,
          }),
          {
            "Content-Type": "application/json",
          }
        ).then((res) => {
          console.log("responseData: " + responseData.message);
          // setIsLoginMode(true)
          navigate("/auth");
        });
      } catch (err) {}
    }
  };

  return (
    <>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      <Card className="auth">
        {/* <h2>Login Required</h2>
        <hr /> */}
        <form onSubmit={authSubmitHandler}>
          {isLoading && <Spinner asOverlay />}
          {!isLoginMode && (
            <>
              <Input
                element="input"
                id="full_name"
                type="text"
                label="Your Full Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a full name."
                onInput={inputHandler}
              />
              <Input
                element="input"
                id="email"
                type="text"
                label="Email"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter an email."
                onInput={inputHandler}
              />
              <Input
                element="textarea"
                id="bio"
                type="text"
                label="Enter a short bio"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a bio."
                onInput={inputHandler}
              />
            </>
          )}
          <Input
            element="input"
            id="username"
            type="username"
            label="Username"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a username"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button
            type="submit"
            // disabled={!formState.isValid}
            className="center-btn"
          >
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler} classNameName="center-btn">
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
