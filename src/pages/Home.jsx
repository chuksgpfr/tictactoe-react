import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Stack, Button } from 'react-bootstrap';
import '../assets/css/home.css'
import CenterModal from '../components/centerModal';
import { useLocation } from "react-router-dom";

import TicTacToe from '../assets/images/tictactoe.png'

const Home = () => {
  const [create, setCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("")
  const [playground, setPlayground] = useState(null)

  const showModal = (title, mode) => {
    setCreate(true)
    setTitle(title)
    setMode(mode)
  }

  const location = useLocation();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const playground = queryParams.get('playground');
    setPlayground(playground);
  }, [])

  return (
    <Container className="p-3">
      <Row>
        <Col className="title">
          <h1> TIC TAC TOE</h1>
          <img src={TicTacToe} alt="tic tac toe" />
          <Stack gap={2} className="col-md-5 mx-auto pt-4">
            {
              playground ?
              <Button variant="info" onClick={() => showModal("Join a room", "joingame")}>Join Game</Button>
              :
              <Button variant="primary" onClick={() => showModal("Create a room for your game", "newgame")} >Create Game</Button>
            }
            
          </Stack>
        </Col>
      </Row>
      <CenterModal title={title} show={create} playground={playground} handleClose={()=> setCreate(false)} mode={mode} />
    </Container>
  )
}

export default Home
