import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCC-3RxtqyZPaihQFqC_M90jQZWYRLX6gU',
	authDomain: 'tasklist-77241.firebaseapp.com',
	projectId: 'tasklist-77241',
	storageBucket: 'tasklist-77241.appspot.com',
	messagingSenderId: '211794023974',
	appId: '1:211794023974:web:f7ffe155beaa35887f38e7',
	measurementId: 'G-32PJ1QSLSM',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
