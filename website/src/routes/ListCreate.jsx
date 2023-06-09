/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import form from '../styles/form.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowLeft, faBackward, faClock, faTrash, faUndo, faX } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TextareaAutosize from 'react-textarea-autosize';
import { useRequest } from '../api';
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react';

import content from '../styles/content.module.css';
import '@djthoms/pretty-checkbox';

const PAGE_NAME = 'New List';

const reorderItems = (items, startIndex, endIndex) => {
	const result = Array.from(items);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const mod = (n, m) => ((n % m) + m) % m;

const safeDelete = (items, id) => items.filter(item => item._id !== id);

const safeMutate = (items, id, updated) => items.map(
	item => item._id === id
		? { ...item, ...updated }
		: item
);

let id = 0;

const newItem = () => ({
	text: '',
	_showDuration: false,
	_minutes: '',
	_seconds: '',
	_id: `draggable_${id++}`,

	calcDuration() {
		return (this._minutes || 0) * 60 + (this._seconds || 0);
	},
});

const ListCreate = () => {
	const [name, setName] = useState('');
	const [items, setItems] = useState([newItem()]);
	const autoplayCheckbox = useCheckboxState();
	const loopCheckbox = useCheckboxState();
	const navigate = useNavigate();
	const req = useRequest();

	const { setTitle } = useOutletContext();
	const location = useLocation();
	useEffect(() => setTitle(PAGE_NAME), [location]);

	const onDragEnd = result => {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		setItems(reorderItems(
			items,
			result.source.index,
			result.destination.index,
		));
	};

	const onSubmit = async e => {
		e.preventDefault();

		await req('/lists', {
			name,
			autoplay: autoplayCheckbox.state,
			loop: loopCheckbox.state,
			text: items.map(i => i.text),
			duration: items.map(i => i.calcDuration()),
		});

		navigate('/lists');
	};

	const DraggableItem = (item, i) => {
		const { _id, _showDuration, _minutes, _seconds } = item;

		const onChangeSecond = e => {
			let seconds = e.target.valueAsNumber || 0;
			if (!_minutes && seconds === -1) {
				seconds = 0;
			}

			const newMinutes = (_minutes || 0) + Math.floor(seconds / 60);

			setItems(safeMutate(items, _id, {
				_minutes: _minutes === '' && newMinutes === 0 ? '' : newMinutes,
				_seconds: e.target.value ? mod(seconds, 60) : '',
			}));
		};

		const onChangeMinute = e => setItems(safeMutate(items, _id, {
			_minutes: e.target.value ? e.target.valueAsNumber : '',
		}));

		return (
			<Draggable key={item._id} draggableId={item._id} index={i}>
				{provided => (
					<div
						className={form.listItem}
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						tabIndex={-1}
					>
						<FontAwesomeIcon
							icon={faClock}
							style={item.calcDuration() !== 0 || _showDuration ? { color: 'var(--primary)' } : null}
							onClick={() => setItems(safeMutate(items, _id, { _showDuration: !_showDuration }))}
							className={form.itemIcon}
						/>
						{_showDuration ? (
							<div className={form.itemTime}>
								<input
									type='number'
									className={form.itemTimeInput}
									min={0}
									value={_minutes.toString().padStart(1, '0')}
									onChange={onChangeMinute}
								/>
								<span> : </span>
								<input
									type='number'
									className={form.itemTimeInput}
									min={-1}
									value={_seconds.toString().padStart(2, '0')}
									onChange={onChangeSecond}
								/>
							</div>
						) : null}
						<TextareaAutosize
							value={item.text}
							onInput={e => setItems(safeMutate(items, _id, { text: e.target.value }))}
							placeholder='Type something!'
							className={form.itemTextInput}
						/>
						<FontAwesomeIcon
							icon={faTrash}
							onClick={() => setItems(safeDelete(items, _id))} 
							className={form.itemIcon}
						/>
					</div>
				)}
			</Draggable>
		);
	};

	return (
		<>
			<div className={content.title}>
				<h1>Create a List</h1>
				<Link to='/lists'>
					<FontAwesomeIcon
						icon={faX}
						className={content.titleIcon}
					/>
				</Link>
			</div>
			<form className={form.form} onSubmit={onSubmit}>
				<input
					placeholder='Name'
					className={form.name}
					type='text'
					value={name}
					onChange={e => {
						setName(e.target.value);
						setTitle(e.target.value || PAGE_NAME);
					}}
				/>
				<div className={form.nameBar} />

				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId='droppable'>
						{provided => (
							<div {...provided.droppableProps} ref={provided.innerRef} className={form.list}>
								{items.map(DraggableItem)}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
				<div
					className={`${form.listItem} ${form.add} clickable`}
					onClick={() => setItems([...items, newItem()])}
				>
					<div>
						<FontAwesomeIcon icon={faAdd} />
					</div>
				</div>

				<Checkbox className={form.checkbox} {...autoplayCheckbox}>Autoplay by default</Checkbox>
				<Checkbox className={form.checkbox} {...loopCheckbox}>Loop by default</Checkbox>
				<button className={form.submit} type='submit'>Create!</button>
			</form>
		</>
	);
};

export default ListCreate;
