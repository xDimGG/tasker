import { faChevronLeft, faChevronRight, faEdit, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { useRequest } from '../api';

import content from '../styles/content.module.css';

const ITEMS = 15;

const Lists = () => {
	const { setTitle } = useOutletContext();
	const location = useLocation();

	const [searchParams, setSearchParams] = useSearchParams();
	const [lists, setLists] = useState([]);
	const [hasMore, setHasMore] = useState(false);
	const req = useRequest();
	const update = () => {
		req(`/users/me/lists?results=${ITEMS}&offset=${ITEMS * page}`)
			.then(res => {
				setLists(res.results);
				setHasMore(res.has_more);
			});
	};

	const navigate = useNavigate();
	const page = parseInt(searchParams.get('page')) || 0;

	useEffect(() => {
		setTitle('Your lists');
		update();
	}, [location, page]);

	return (
		<>
			<div className={content.title}>
				<h1>Your Lists</h1>
				<Link to='/lists/new'>
					<FontAwesomeIcon
						icon={faPlusCircle}
						className={content.titleIcon}
					/>
				</Link>
			</div>
			{lists.map(({ id, name }) => (
				<Link to={`/lists/${id}`} key={id} className={content.list}>
					<span>{name}</span>
					<FontAwesomeIcon
						icon={faEdit}
						className={content.titleIcon}
						onClick={e => { e.preventDefault(); navigate(`/lists/${id}?edit`); }}
					/>
					<FontAwesomeIcon
						icon={faTrash}
						className={content.titleIcon}
						onClick={e => { e.preventDefault(); req(`/lists/${id}`, null, 'DELETE').then(update); }}
					/>
				</Link>
			))}
			<div className={content.pagination}>
				<FontAwesomeIcon
					icon={faChevronLeft}
					className={page > 0 ? content.active : content.inactive}
					onClick={() => page > 0 && setSearchParams(val => {
						if (page === 1)
							val.delete('page');
						else
							val.set('page', page - 1);
						return val;
					})}
				/>
				<FontAwesomeIcon
					icon={faChevronRight}
					className={hasMore ? content.active : content.inactive}
					onClick={() => hasMore && setSearchParams(val => { val.set('page', page + 1); return val; })}
				/>
			</div>
		</>
	);
};

export default Lists;
