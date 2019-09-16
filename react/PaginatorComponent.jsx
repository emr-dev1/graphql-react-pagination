import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash-es';

import {
	Paginator_div,
	Paginator_ul,
	Paginator_li,
	Paginator_information_div,
} from './PaginatorStyles';

import Spinner from '../../../shared/Spinner/SpinnerComponent';

/**
 * Component to handle pagination.
 */
function PaginatorComponent({ edges, totalCount, hasNextPage, onLoadMore }) {
	const handleOnScroll = (e) => {
		if (hasNextPage && e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight) {
			console.log('making request for more edges');
			onLoadMore();
			console.log('completed request for more edges');
		}
	};

	const renderItems = () => {
		return map(edges, ({ cursor, node }) => (
			<Paginator_li key={cursor}>
				{node.name} {node.business_id}
			</Paginator_li>
		));
	};

	return (
		<Paginator_div>
			<Paginator_ul onScroll={handleOnScroll}>
				{renderItems()}
			</Paginator_ul>
			<Paginator_information_div>
				<ul>
					<li>Total Count: {totalCount}</li>
					<li>Edges Amount: {edges.length}</li>
				</ul>
			</Paginator_information_div>
		</Paginator_div>
	);
}

PaginatorComponent.propTypes = {
	edges: PropTypes.array.isRequired,
	totalCount: PropTypes.number.isRequired,
	hasNextPage: PropTypes.bool.isRequired,
	onLoadMore: PropTypes.func.isRequired,
};

export default PaginatorComponent;
