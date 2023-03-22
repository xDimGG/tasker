import { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

const ListView = () => {
	const { id } = useParams();
	console.log(id);
	const { setTitle } = useOutletContext();
	useEffect(() => setTitle(`List ${id}`), [setTitle, id]);

	return (
		<>
			<h1>View List</h1>
		</>
	);
};

export default ListView;
