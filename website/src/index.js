import React from 'react';
import { createRoot } from 'react-dom/client';
import { browserLocalPersistence, setPersistence, signInAnonymously } from 'firebase/auth';
import {
	BrowserRouter,
	Route,
	Routes
} from 'react-router-dom';
import { auth } from './firebase';

import './styles/index.css';
import App from './App';
import Home from './routes/Home';
import Lists from './routes/Lists';
import ListCreate from './routes/ListCreate';
import List from './routes/List';

const app = createRoot(document.getElementById('root'));
// Can't use React.StrictMode because of react-beautiful-dnd
const show = () => app.render(
	<BrowserRouter>
		<Routes>
			<Route element={<App />}>
				<Route path='/' element={<Home />} />
				<Route path='/lists'>
					<Route index element={<Lists />} />
					<Route path='new' element={<ListCreate />} />
					<Route path=':id' element={<List />} />
				</Route>
			</Route>
		</Routes>
	</BrowserRouter>
);

setPersistence(auth, browserLocalPersistence)
	.then(() => auth.currentUser || signInAnonymously(auth))
	.then(show)
	.catch(err => {
		console.error(err);
		app.render(
			<React.StrictMode>
				<h1>Could not connect to Firebase</h1>
			</React.StrictMode>
		);
	});
