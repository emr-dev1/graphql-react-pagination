import styled from 'styled-components';

export const Paginator_div = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	color: black;
`;

export const Paginator_information_div = styled.div`
	display: flex; 
	flex-direction: column;
	flex: 1;
	justify-content: center;
`;

export const Paginator_resultsHeader_div = styled.div`
	display: flex;
	flex: 1;
	text-align: center;
	font-size: 2em;
`;

export const Paginator_ul = styled.ul`
	display: flex;
	flex-direction: column;
	list-style: none;
	margin: 0;
	padding: 0;
	height: 200px;
	width: 100px;
	overflow: auto;
`;

export const Paginator_li = styled.li`
	height: 50px;
	width: 100%;
	color: black;
`;
