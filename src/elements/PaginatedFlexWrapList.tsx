import React from 'react';
import Button from './Button';
import HSpace from './HSpace';

function PaginatedFlexWrapList<T>(props: {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  maxItemsPerPage: number;
}) {
  const [page, setPage] = React.useState(0);
  const items = props.items.slice(
    page * props.maxItemsPerPage,
    (page + 1) * props.maxItemsPerPage
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          color="plain"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          style={{
            marginLeft: '8px',
          }}
        >
          Prev
        </Button>
        <HSpace />
        <div>
          Page {page + 1} of{' '}
          {Math.ceil(props.items.length / props.maxItemsPerPage)}
        </div>
        <HSpace />
        <Button
          color="plain"
          onClick={() => setPage(page + 1)}
          disabled={(page + 1) * props.maxItemsPerPage >= props.items.length}
          style={{
            marginRight: '16px',
          }}
        >
          Next
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {items.map(props.renderItem)}
      </div>
    </div>
  );
}

export default PaginatedFlexWrapList;
