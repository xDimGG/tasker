import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignIn, faListCheck, faList, faSignOut,  } from '@fortawesome/free-solid-svg-icons';
import { signInAnonymously, signInWithPopup, signOut } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { useRequest } from './api';

import './styles/app.css';
import { useEffect, useState } from 'react';

const provider = new GoogleAuthProvider();

const Wrapper = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	background-color: transparent;
	grid-template-columns: 170px 1fr;
	grid-template-rows: 40px 1fr 40px;
	grid-template-areas:
		'logo       content'
		'navigation content'
		'profile    title';
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradient 20s ease infinite;

	@media (max-width: 768px) {
		grid-template-columns: 0 1fr;
		gap: 0;
		border-radius: 0;
	}
`;

const Logo = styled.div`
	grid-area: logo;
	border-bottom: 1.5px var(--bright) solid;
`;

const Navigation = styled.div`
	grid-area: navigation;
	display: flex;
	flex-direction: column;
	justify-content: center;
	border-bottom: 1.5px var(--bright) solid;
`;

const Profile = styled.div`
	grid-area: profile;
`;

const Title = styled.div`
	grid-area: title;
	border-left: 1.5px var(--bright) solid;
	background-color: var(--bright-darker);
	font-size: 20px;
	color: var(--dark);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Content = styled.div`
	overflow-y: scroll;
	color: var(--dark);
	background-color: var(--bright);
	grid-area: content;
`;

const ContentWrapper = styled.div`
	width: 85%;
	max-width: 1600px;
	margin: 7px auto;
	background-color: var(--bright-dark);
	border-radius: 10px;
	padding: 10px 25px;

	@media (max-width: 768px) {
		margin: 0;
		border-radius: 0;
		border-left: none;
		width: 100%;
	}
`;

let fetchingUser = false;

const App = () => {
	const [title, setTitle] = useState('');
	const [fbUser, setFBUser] = useState(null);
	const [user, setUser] = useState(null);
	const req = useRequest();

	useEffect(() => { document.title = title; }, [title]);

	useEffect(() => auth.onAuthStateChanged(async newUser => {
		setFBUser(newUser);
		if (!newUser) return setUser(false);

		if (fetchingUser) return;
		if (!fbUser || (fbUser.uid !== newUser.uid)) {
			fetchingUser = true;
			try {
				setUser(await req('/login', {
					name: newUser.displayName,
					from: fbUser?.isAonymous ? await fbUser.getIdToken() : undefined,
				}));
			} finally {
				fetchingUser = false;
			}
		}
	}), [req, user, fbUser]);

	const signIn = () => signInWithPopup(auth, provider).catch(error => alert(error.message));
	const goAnonymous = () => signOut(auth).then(() => signInAnonymously(auth));

	return (
		<Wrapper>
			<Logo className='iconText'>
				<FontAwesomeIcon icon={faListCheck} />
				<span>Tasker</span>
			</Logo>
			<Navigation>
				<NavLink to='/' className='iconText'>
					<FontAwesomeIcon icon={faHome} />
					<span>Home</span>
				</NavLink>
				<NavLink to='/lists' className='iconText'>
					<FontAwesomeIcon icon={faList} />
					<span>Lists</span>
				</NavLink>
			</Navigation>
			<Profile className='iconText'>
				{user?.name ? (
					<>
						<FontAwesomeIcon icon={faSignOut} onClick={goAnonymous} className={'clickable'} />
						<span>{user.name}</span>
					</>
				) : (
					<>
						<FontAwesomeIcon icon={faSignIn} onClick={signIn} className={'clickable'} />
						<span>Anonymous</span>
					</>
				)}
			</Profile>

			<Content>
				<ContentWrapper>
					<Outlet context={{ fbUser, setTitle }} />
				</ContentWrapper>
			</Content>
			<Title>
				{title}
			</Title>
		</Wrapper>
	);
};

export default App;
