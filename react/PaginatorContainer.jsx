import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import PaginatorComponent from './PaginatorComponent';

const BUSINESS_CONNECTIONS_QUERY = gql`
	query BusinessConnectionsQuery($first: Int, $last: Int, $before: String, $after: String) {
		businessConnection(first: $first, last: $last, before: $before, after: $after) {
			edges {
				cursor
				node {
					business_id
					name
					phone_number
					state
					latitude
					longitude
				}
			}
			pageInfo {
				startCursor
				endCursor
				hasNextPage
				hasPreviousPage
			}
			totalCount
		}
	}
`;

const PaginatorContainer = ({ client }) => {
	const [startCursor, setStartCursor] = useState('');
	const [endCursor, setEndCursor] = useState('');
	const [edges, setEdges] = useState([]);
	const [numberOfNodes, setNumberOfNodes] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [hasNextPage, setHasNextPage] = useState(false);

	const {
		data,
		loading,
		fetchMore,
	} = useQuery(BUSINESS_CONNECTIONS_QUERY, { client, variables: { first: 20 } });

	const setState = useCallback(() => {
		if (!loading) {
			const { pageInfo, edges, totalCount } = data.businessConnection;
			setTotalCount(totalCount);
			setStartCursor(pageInfo.startCursor);
			setEndCursor(pageInfo.endCursor);
			setHasNextPage(pageInfo.hasNextPage);
			setEdges(edges);
		}
	}, [data, loading]);

	const onLoadMore = () => fetchMore({
		variables: {
			first: 30,
			after: endCursor
		},
		updateQuery: (previousResult, { fetchMoreResult }) => {
			const newEdges = fetchMoreResult.businessConnection.edges;
			const pageInfo = fetchMoreResult.businessConnection.pageInfo;

			if (newEdges.length) {
				setNumberOfNodes(numberOfNodes + newEdges.length);
			}

			return newEdges.length ? {
				businessConnection: {
					__typename: previousResult.businessConnection.__typename,
					edges: [...previousResult.businessConnection.edges, ...newEdges],
					pageInfo,
					totalCount: fetchMoreResult.businessConnection.totalCount
				}
			} : previousResult;
		}
	});

	useEffect(() => {
		setState();
	}, [setState]);

	return (
		<PaginatorComponent
			edges={edges}
			totalCount={totalCount}
			onLoadMore={onLoadMore}
			hasNextPage={hasNextPage}
		/>
	);
};

export default withApollo(PaginatorContainer);
