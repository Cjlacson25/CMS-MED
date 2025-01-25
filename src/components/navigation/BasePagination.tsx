import React, { useState } from 'react';
import Pagination, { PaginationProps } from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

interface BasePaginationProps<T> {
	items: T;
	className?: string;
	itemsPerPage?: number;
	render: (data: T) => React.ReactNode;
	rowGap?: string | number;
	position?: 'left' | 'center' | 'right';
}

const Root = styled('div', {
	shouldForwardProp: (prop) => prop !== 'rowGap',
})<Partial<BasePaginationProps<any>>>((props) => ({
	display: 'flex',
	flexDirection: 'column',
	rowGap: props.rowGap ?? '40px',
}));

function BasePagination<T extends any[]>({
	items,
	render,
	itemsPerPage = 10,
	className,
	rowGap,
	position,
	...props
}: BasePaginationProps<T> & PaginationProps) {
	const [page, setPage] = useState(1);

	return (
		<Root {...{ className, rowGap }}>
			{render(items?.slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage) as T)}

			<Pagination
				page={page}
				color="primary"
				sx={{
					display: 'flex',
					justifyContent: position === 'left' ? 'flex-start' : position === 'right' ? 'flex-end' : 'center',
				}}
				count={Math.ceil(items.length / itemsPerPage) > 0 ? Math.ceil(items.length / itemsPerPage) : 1}
				shape="rounded"
				onChange={(e, value) => setPage(value)}
				{...props}
			/>
		</Root>
	);
}

export default BasePagination;
