import React, { useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom'  
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from '../../shared/context/auth-context';



const UpdatePost = () => {
  const { postId } = useParams();
  const { isLoading, sendRequest} = useHttpClient();
  const navigate = useNavigate();
  const [formState, inputHandler, setFormData] = useForm({});
  const [loadedPost, setLoadedUser] = useState();
  const  auth  = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      const resData = await sendRequest(
        `http://localhost:8000/posts/${postId}`,"GET",
      );       
      setLoadedUser(resData["post"]);
    };
    fetchProfile();
  }, [postId, sendRequest, setFormData]);
  const UpdateSubmitHandler = async (event) => {
    event.preventDefault()
    var created = new Date()
    try {
      var body = {
        id: postId,
        title: formState.inputs.title.value,
        content: formState.inputs.content.value,
        created: created,
        price : formState.inputs.price.value,
        user_id : auth.userId
      };
      await sendRequest(
        `http://localhost:8000/posts/${postId}`,
        "PUT",
        JSON.stringify(body),

      );
      navigate("/my-posts");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ marginTop: "4em" }}>
      <Card>
        {!isLoading && loadedPost && (
          <form className="user-form" onSubmit={UpdateSubmitHandler}>
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title"
              onInput={inputHandler}
              initialValue={loadedPost.title}
              initialValid={true}
            />
            <Input
              id="content"
              element="input"
              type="text"
              label="Content"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid content"
              onInput={inputHandler}
              initialValue={loadedPost.content}
              initialValid={true}
            />
            <Input
              id="price"
              element="input"
              type="float"
              label="Price"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid number"
              onInput={inputHandler}
              initialValue={loadedPost.price}
              initialValid={true}
            />
            <Button type="submit">
              Submit
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export default UpdatePost;