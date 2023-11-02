import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import './Styles/app.css';
import { Routes, Route } from 'react-router';
import Header from './Components/Header';
import LandingPage from './Components/LandingPage';
import MapTrack from './Components/MapTrack';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Header/>}>
          <Route index element={<LandingPage /> } />
          <Route path='maptrack/' element={<MapTrack />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
