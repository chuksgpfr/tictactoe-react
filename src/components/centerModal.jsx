import React from "react";
import { Modal } from "react-bootstrap";
import CreateGame from "./createGame";
import JoinGame from "./joinGame";

const CenterModal = ({title, show, handleClose, mode, playground = null}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {
          mode === "newgame" &&
          <CreateGame />
        }
        {
          mode === "joingame" &&
          <JoinGame playground={playground} />
        }
      </Modal.Body>

      {/* <Modal.Footer>
        <Button variant="secondary">Close</Button>
        <Button variant="primary">Save changes</Button>
      </Modal.Footer> */}
    </Modal>
  );
};

export default CenterModal;
