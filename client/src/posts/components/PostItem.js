import React, { useEffect, useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Spinner from "../../shared/components/UIElements/Spinner";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";

import "./PostItem.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const PostItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const auth = useContext(AuthContext);
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const cancelDetailsHandler = () => {
    setShowDetailsModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);

    try {
      await sendRequest(
        `http://localhost:8000/posts/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      props.onDelete(props.id);
    } catch (err) {
      console.log(err);
    }
  };

  const popDetailsModal = () => {
    setShowDetailsModal(true);
  };

  //   use    Effect(() => {
  //     console.log("in");
  //   }, []);

  return (
    <>
      <Modal
        show={showDetailsModal}
        onCancel={cancelDetailsHandler}
        header={props.title}
        footerClass="post-item__modal-actions"
        footer={
          <>
            <div className="post-item__actions">
              {auth.userId === props.creatorId && (
                <Button inverse to={`/posts/${props.id}`}>
                  UPDATE
                </Button>
              )}
              {auth.userId === props.creatorId && (
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              )}
            </div>
          </>
        }
      >
        {props.description}
      </Modal>

      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="posts-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        This can't be undone
      </Modal>

      <li className="post-item" onClick={popDetailsModal}>
        <Card className="post-item__content">
          {isLoading && <Spinner />}
          <div className="post-item__image">
            <img
                src={`http://localhost:8000/${props.image_url}`}
            //   src={"http://localhost:8000/static/uploads/image1.png"}
              alt={props.content}
            />
          </div>
          <div className="post-item__info">
            <p>{props.content}</p>
          </div>
        </Card>
      </li>
    </>
  );
};

export default PostItem;
