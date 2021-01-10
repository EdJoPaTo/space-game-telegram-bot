import test from 'ava';

import {distanceBetween} from './position';

test('only x', t => {
	const distance = distanceBetween({x: 0, y: 0}, {x: 1, y: 0});
	t.is(distance, 1);
});

test('only y', t => {
	const distance = distanceBetween({x: 0, y: 0}, {x: 0, y: 5});
	t.is(distance, 5);
});

test('diagonal', t => {
	const distance = distanceBetween({x: 0, y: 0}, {x: 3, y: 4});
	t.is(distance, 5);
});
