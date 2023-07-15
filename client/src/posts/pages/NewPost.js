import React, { useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "../components/PostItem.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/form-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

import { VALIDATOR_REQUIRE } from "../../shared/util/validators";

const NewPost = () => {
  const { isLoading, error, sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm({});
  const [loadedUser, setLoadedUser] = useState({});
  //console.log(auth)
  const SubmitHandler = async (event) => {
    event.preventDefault();
    var created = new Date();
    try {
      var body = {
        user_id: auth.userId,
        content: formState.inputs.content.value,
        image: formState.inputs.image.value,
      };
      var formData = new FormData();
      formData.append('user_id', auth.userId)
      formData.append('content', formState.inputs.content.value)
      formData.append('image', formState.inputs.image.value)

      console.log(formData);

      await sendRequest(
        `http://localhost:8000/posts`,
        "POST",
        // JSON.stringify(body),
        formData,
        {
          // "Content-Type": "application/json",
          // "Content-Type": "multipart/form-data",
          // "Accept": "multipart/form-data",
          "Authorization": "Bearer " + auth.token,
        }
      );
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ width: "50%", alignSelf: "center", margin: "8em auto"}}>
      <Card>
        {!isLoading && loadedUser && (
          <form className="user-form" onSubmit={SubmitHandler} encType="multipart/form-data">
            <Input
              id="content"
              element="input"
              type="textarea"
              label="Content"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter some content"
              onInput={inputHandler}
            />
            <ImageUpload
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image"
            />
            <Button type="submit">Submit</Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default NewPost;
