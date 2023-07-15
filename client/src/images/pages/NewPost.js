import React, { useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "../components/PostItem.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";


import {
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";


const NewPost = () =>{
  const { isLoading, error, sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm({});
  const [loadedUser, setLoadedUser] = useState({});
  //console.log(auth)
  const SubmitHandler = async (event) => {
    event.preventDefault()
    var created = new Date()
    try {
      var body = {
        user_id: ''+auth.userId,
        title: formState.inputs.title.value,
        content: formState.inputs.content.value,
        price : formState.inputs.price.value,
        created: created
      };
      console.log(body)
      await sendRequest(
        `http://localhost:8000/posts`,
        "POST",
        JSON.stringify(body),
        {
          "Content-Type": "application/json",
          Authorization: "token " + auth.token,
        }
      );
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ marginTop: "4em" }}>
      <Card>
        {!isLoading && loadedUser && (
          <form className="user-form" onSubmit={SubmitHandler}>
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title"
              onInput={inputHandler}
            />
            <Input
              id="content"
              element="input"
              type="textarea"
              label="Content"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter some content"
              onInput={inputHandler}
            />
            <Input
              id="price"
              element="input"
              type="number"
              label="Price"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter valid price"
              onInput={inputHandler}
            />
            <Button type="submit" >
              Submit
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};


export default NewPost;