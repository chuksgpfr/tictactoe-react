import React, { useEffect, useState } from "react";
import { ActionCableConsumer } from "react-actioncable-provider";
import { Container, Row, Col, Card, Stack, Button } from "react-bootstrap";
import apiConfig from "../configs/axios";
import '../assets/css/home.css'
import { useParams, useNavigate } from "react-router-dom";

import checkWinning from "../helpers/checkWin";
import updatePlayground from "../services/updatePlayground";
import checkIfPlayer from "../helpers/checkPlayer";
import copyLink from "../helpers/copyLink";
import checkWinner from "../helpers/checkWinner";


const Room = () => {
  const [playgroundId, setPlaygroundId] = useState(null);
  const [symbol, setSymbol] = useState(null)
  const [tiles, setTiles] = useState({})
  const [roomDetails, setRoomDetails] = useState(null)
  const [player, setPlayer] = useState(null);
  const [playgroundParams, setPlaygroundParams] = useState(null);
  const [scores, setScores] = useState("0 : 0")
  const [isComplete, setIsComplete] = useState(false);
  const [isWon, setIsWon] = useState(false);


  const params = useParams();
  const navigate = useNavigate();

  const makeMove = async (tile, symbol) => {
    if (isWon) {
      setIsComplete(true)
      const winner = checkWinner(playgroundId, roomDetails);
      alert(`${winner} has already won this round, please restart`)
      return;
    }
    //check if tile is filled
    if(tiles[tile]) {
      console.log("This is already filled");
      return;
    }

    //check if layer is next
    if (roomDetails.next !== player.name) {
      alert("It's not your turn yet.")
      return;
    }

    setTiles({...tiles, [tile]: symbol})
    await playGame({...tiles, [tile]: symbol})

    if(roomDetails.moves){
      const moves = {...tiles, [tile]: symbol}
      console.log("tiles", moves);
      const isWon = checkWinning(symbol, moves);
      console.log([symbol, isWon]);
      if (isWon === "won") {
        setIsWon(true);
        setIsComplete(true);

        const score = JSON.parse(roomDetails.scores) ?? [0,0];

        const status = symbol === "X" ? { X: "won", O: "lost"} : { X: "lost", O: "won"};
        const newScore = symbol === "X" ? [score[0] + 1, score[1]] : [score[0], score[1] + 1]

        const updateBody = {
          scores: JSON.stringify(newScore),
          status: JSON.stringify(status),
          wonby: symbol
        }
        await updatePlayground(updateBody, playgroundId)

        setTimeout(() => {
          alert("Congratulations, you have won this round !!! ")
          return;
        }, 1000);
      }

      if(isWon === "draw") {
        setIsComplete(true);
      }
    }

    if(tiles && Object.values(tiles).length === 9) {
      setIsComplete(true);
    }
  }

  const playGame = async (moves) => {
    const people = JSON.parse(roomDetails.people);

    if(people.length > 1) {
      const currentPlayer = people.indexOf(player.name);
      roomDetails.next = currentPlayer === 0 ? people[1] : people[0];
    }else {
      roomDetails.next = ""
    }
    const updateBody = {
      next: roomDetails.next,
      moves: JSON.stringify(moves)
    }
    await updatePlayground(updateBody, playgroundId);
  }

  const playing = (response) => {
    
    if (response.moves){
      setTiles(JSON.parse(response.moves))
    } else {
      setTiles({})
      setIsComplete(false)
    }
    setRoomDetails(response);
    const people = JSON.parse(response.people);
    const scoreNum = JSON.parse(response.scores);
    setScores(`${people[0]} ${scoreNum[0]} : ${scoreNum[1]} ${people[1]}`)

    const status = JSON.parse(response.status);
    if (status.X !== "play") {
      setIsWon(true);
      setIsComplete(true);
    }
  }

  const restartGame = async () => {
    try {

      const updateBody = {
        next: roomDetails.next,
        moves: "",
        status: JSON.stringify({X:"play",O:"play"}),
        wonby: ""
      }

      await updatePlayground(updateBody, playgroundId)

      setTiles({});
      setIsWon(false);
      setIsComplete(false)

    } catch (error) {
      alert("Server Error: Failed to restart game, please try again");
      return;
    }
  }

  useEffect(() => {
    console.log("No reason", Object.values(tiles).length);
    if(tiles && Object.values(tiles).length === 9) {
      setIsComplete(true);
    }
    const encoded = params.room;
    setPlaygroundParams(encoded)

    const decoded = Buffer.from(encoded, 'base64').toString('ascii');

    let decodedJson;

    try {
      decodedJson = JSON.parse(decoded);
    } catch (error) {
      alert("This is not a valid playground !!!")
      return window.location.href = "/";
    }

    if(!decodedJson.roomName && !decodedJson.password && !decodedJson.id) {
      alert("This is not a valid playground !!!")
      return window.location.href = "/";
    }

    const isAPlayer = checkIfPlayer(decodedJson.id.toString());

    if (!isAPlayer) {
      alert("You are not a player in this game")
      return window.location.href = `/playground?${encoded}`;
    }

    setPlayer(isAPlayer);
 
    async function startGame() {
      const { data } = await apiConfig().get(`/v1/playground/${decodedJson.id}`);
      if(data && data.moves) {
        setTiles(JSON.parse(data.moves))
        const status = JSON.parse(data.status);
        if (status.X !== "play") {
          setIsWon(true);
          setIsComplete(true);
        }
      }
      setRoomDetails(data);
      const people = JSON.parse(data.people);
      const scoreNum = JSON.parse(data.scores);
      setScores(`${people[0]} ${scoreNum[0]} : ${scoreNum[1]} ${people[1]}`)
      console.log("DATA ==> ", tiles);
    }

    startGame()

    setPlaygroundId(decodedJson.id)
    setSymbol(isAPlayer.symbol)
    
  },[])
  
  return (
    <Container className="game-box">
      <ActionCableConsumer 
        channel = {{ channel: "PlaygroundChannel"}}
        onReceived = {playing}
      />
      <Row>
        <Col>
          <Stack>
            <h1 className="title"> TIC TAC TOE</h1>
            <h1 className="title"> {scores}</h1>
            <Button className="secondary" onClick={()=> navigate("/") } > Home </Button><br/>
          </Stack>
          <Card style={{ width: "auto" }}>
            <Card.Body>
              <div className="game-board">
                <div className="box" onClick={()=>makeMove("0", symbol)}>{tiles["0"] ?? ""}</div>
                <div className="box" onClick={()=>makeMove("1", symbol)}>{tiles["1"] ?? ""}</div>
                <div className="box" onClick={()=>makeMove("2", symbol)}>{tiles["2"] ?? ""}</div>
                <div className="box" onClick={()=>makeMove("3", symbol)}>{tiles["3"] ?? ""}</div>
                <div className="box" onClick={()=>makeMove("4", symbol)}>{tiles["4"] ?? ""}</div>
                <div className="box" onClick={()=>makeMove("5", symbol)}>{tiles["5"] ?? ""}</div>
                <div className="box" onClick={()=>makeMove("6", symbol)}>{tiles["6"] ?? ""}</div>
                <div className="box" onClick={()=>makeMove("7", symbol)}>{tiles["7"] ?? ""}</div>
                <div className="box" onClick={()=>makeMove("8", symbol)}>{tiles["8"] ?? ""}</div>
              </div>
            </Card.Body>
          </Card>
          <br/>
          <Row>
            <Col md={4}>
              <Button className="primary" onClick={()=>copyLink(playgroundParams)}> Copy Playground Link</Button>
            </Col>
            <Col md={{ span: 4, offset: 4 }}>
              {
                isComplete && <Button variant="info" onClick={() => restartGame()} > Restart Game </Button>
              }
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Room;
