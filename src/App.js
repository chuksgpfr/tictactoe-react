import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={ <Home /> } />
      <Route exact path="/room/:room" element={ <Room /> } />
    </Routes>
  );
}

export default App;
