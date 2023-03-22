import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

const Lists = () => {
	const { setTitle } = useOutletContext();
	useEffect(() => setTitle('Lists'), [setTitle]);

	return (
		<>
			<h1>Your Lists</h1>
		</>
	);
};

export default Lists;
