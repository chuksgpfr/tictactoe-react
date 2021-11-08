import React, { useEffect, useState } from 'react'
import { Form, Button } from "react-bootstrap";
import apiConfig from "../configs/axios";

const JoinGame = ({playground}) => {
  const [room, setRoom] = useState(null)
  const [thePlayground, setThePlayground] = useState(null)
  const [username, setUsername] = useState("");


  const getPlayground = async (id) => {
    try {
      const { data } = await apiConfig().get(`/v1/playground/${id}`);
      console.log("The play ", data);
      setThePlayground(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  const join = async (e) => {
    e.preventDefault();
    try {
      if (!username) {
        alert("Please select a username !!!");
        return;
      }
      
      const people = JSON.parse(thePlayground.people)
      if (people.length > 1) {
        alert("Sorry this room is filled !!!");
        return;
      }

      if (username === people[0]) {
        alert("You can't use same username as the other player, please select another username !!!");
        return;
      }
      people.push(username);

      const body = {
        next: thePlayground.next ? thePlayground.next : username,
        people: JSON.stringify(people)
      }
      const { data } = await apiConfig().patch(`/v1/playground/${room.id}`, body);
      console.log("Joined", data);

      const Lstorage = {
        id: room.id,
        symbol: "O",
        name: username
      }
      localStorage.setItem(room.id.toString(), JSON.stringify(Lstorage));

      window.location.href = `/room/${playground}`
    } catch (error) {
      console.log(error);
      alert("Server Error: Failed to join this playgorund")
    }
  }

  useEffect(() => {
    console.log(playground);
    const decoded = Buffer.from(playground, 'base64').toString('ascii');

    let decodedJson;

    try {
      decodedJson = JSON.parse(decoded);
    } catch (error) {
      alert("This is not a valid playground !!!")
      return window.location.href = "/";
    }

    console.log(decodedJson);
    setRoom(decodedJson)
    getPlayground(decodedJson.id);

  }, [])
  return (
    <Form onSubmit={join}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Your name</Form.Label>
        <Form.Control type="text" placeholder="Enter your name" onChange={ (e) => setUsername(e.target.value) } />
        <Form.Text className="text-muted">
          This will be the name display name
        </Form.Text>
      </Form.Group>

      {/* <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="text" placeholder="Password" />
        <Form.Text className="text-muted">
          The password that was used to create this room
        </Form.Text>
      </Form.Group> */}

      <Button variant="primary" type="submit">
        Join
      </Button>
    </Form>
  )
}

export default JoinGame
