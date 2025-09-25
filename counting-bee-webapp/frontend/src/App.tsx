import React from 'react';
import './App.css';
import Game from './components/Game/Game';
import Admin from './components/Admin/Admin';

function App() {
  // Simple router for /admin
  const isAdmin = window.location.pathname.startsWith('/admin');
  return (
    <div className="App">
      {isAdmin ? <Admin /> : <Game />}
    </div>
  );
}

export default App;
