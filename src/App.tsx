import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { GameView } from './components/GameView';
import { HomeCard } from './components/HomeCard';
import { HomeView } from './components/HomeView';
import { NavBar } from './components/NavBar';

function App() {
	
	return (
		<>
			<BrowserRouter>
				
				<Routes>
					<Route path="/" element={<HomeView />}/>
					<Route path="/:language" element={<HomeView />}/>
					<Route path="/place/:placeId" element={<GameView />}/>
					<Route path="/:language/place/:placeId" element={<GameView />}/>
				</Routes>
			</BrowserRouter>			
		</>
	);
}

export default App;
