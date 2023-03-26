import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

let BASE;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	BASE = 'http://localhost:8080';
} else {
	BASE = window.location.origin;
}

BASE += '/api';

// path and token are required
const request = (path, token, body, method) => fetch(`${BASE}${path[0] === '/' ? '' : '/'}${path}`, {
	// If a method was supplied, use the method
	// Otherwise, assume the request was POST if a body was supplied
	// or GET if no body was supplied
	method: method || (body ? 'POST' : 'GET'),

	// If a body was supplied, stringify the body
	body: body ? JSON.stringify(body) : null,

	// Headers
	headers: {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	},

	// Allow redirects
	redirect: 'follow',
});

const useRequest = () => {
	const navigate = useNavigate();
	const auth = getAuth();

	return (path, body, method) => auth.currentUser
		.getIdToken()
		.then(token =>
			request(path, token, body, method)
				.then(async res => {
					const parsed = await ((res.headers.get('Content-Type') || '').includes('application/json')
						? res.json()
						: res.text());

					if ([404, 500].includes(res.status)) {
						navigate(-1);
						throw parsed || res.statusText;
					}

					return parsed;
				})
		);
};

window.useReq = useRequest;

export { request, useRequest };
