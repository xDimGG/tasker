import { Checkbox, useCheckboxState } from 'pretty-checkbox-react';
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useRequest } from '../api';

import content from '../styles/content.module.css';
import form from '../styles/form.module.css';
import '@djthoms/pretty-checkbox';

const List = () => {
	const { id } = useParams();
	const [list, setList] = useState(null);
	const req = useRequest();

	const autoplayCheckbox = useCheckboxState();
	const loopCheckbox = useCheckboxState();

	const { setTitle } = useOutletContext();
	useEffect(() => { setTitle(list?.name || `Fetching ${id}`); }, [id, list]);
	useEffect(() => { req(`/lists/${id}`).then(data => {
		data.items.sort((a, b) => a.order - b.order);
		autoplayCheckbox.setState(data.autoplay);
		loopCheckbox.setState(data.loop);
		setList(data);
	}); }, [id]);

	console.log(list);
	if (!list) return (<h1>Loading List</h1>);

	return (
		<>
			<div className={content.title}>
				<h1>{list.name}</h1>
			</div>

			<div className={form.form}>
				<Checkbox className={form.checkbox} {...autoplayCheckbox}>Autoplay</Checkbox>
				<Checkbox className={form.checkbox} {...loopCheckbox}>Loop</Checkbox>

				{list.items.map(item => (
					<div className={content.listItem}>{item.text}</div>
				))}
			</div>
		</>
	);
};

export default List;
