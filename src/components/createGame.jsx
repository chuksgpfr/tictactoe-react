import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {v4} from "uuid";
import apiConfig from "../configs/axios";

const CreateGame = () => {
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [playground, setPlayground] = useState("");

  const generatePassword = () => {
    const id = v4();
    const ids = id.split("-");
    setPassword(ids[0])
  }

  

  async function joinGame(e) {
    e.preventDefault();
    try {

      const players = [name];

      const body = {
        roomName: playground,
        password,
        username: name,
        moves: "",
        people: JSON.stringify(players),
        next: name,
        scores: JSON.stringify([0,0]),
        status: JSON.stringify({
          X: "play",
          O: "play"
        })
      }

      const { data } = await apiConfig().post("/v1/playground", body);

      const Lstorage = {
        id: data.id,
        symbol: "X",
        name: name,
      }
      localStorage.setItem(data.id.toString(), JSON.stringify(Lstorage));

      const urlBody = {
        id: data.id,
        roomName: playground,
        password
      }
  
      const encoded = Buffer.from(JSON.stringify(urlBody)).toString('base64');
      window.location.href = `/room/${encoded}`

    } catch (error) {
      alert("Server Error: Failed to join game !!!");
    }
  }

  return (
    <Form noValidate onSubmit={joinGame}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Your name</Form.Label>
        <Form.Control type="text" placeholder="Enter your name" onChange={(e)=> setName(e.target.value)} />
        <Form.Text className="text-muted">
          This will be the name display name
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Playground</Form.Label>
        <Form.Control type="text" placeholder="Enter playground name" onChange={(e)=> setPlayground(e.target.value)} />
        <Form.Text className="text-muted">
          This will serve as the playground name
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="text" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />
        <Form.Text className="text-muted">
          This will be used by your opponent to join this game
        </Form.Text>
      </Form.Group>
      

      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="allow people to watch this game" onChange={()=> setPublicView(!publicView)} checked={publicView}/>
      </Form.Group> */}

      <Button variant="primary" type="submit">
        Create
      </Button>
      <Button variant="secondary" className="m-4" onClick={generatePassword} >
        Generate password
      </Button>
    </Form>
  );
};

export default CreateGame;
