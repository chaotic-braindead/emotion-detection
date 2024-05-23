import React from 'react';
import EmotionDetection from './components/EmotionDetection';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameOver from './pages/gameover';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<EmotionDetection />} />
          <Route path="/gameover" element={<GameOver />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
