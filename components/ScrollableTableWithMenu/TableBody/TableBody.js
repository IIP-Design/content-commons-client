import React from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';

import { Table } from 'semantic-ui-react';
import TableRow from 'components/ScrollableTableWithMenu/TableRow/TableRow';
import TableBodyMessage from './TableBodyMessage';

import './TableBody.scss';

const TableBody = ( {
  bodyPaginationVars,
  column,
  data,
  direction,
  error,
  loading,
  projectTab,
  searchTerm,
  selectedItems,
  tableHeaders,
  toggleItemSelection,
  team
} ) => {
  if ( error ) return <TableBodyMessage error={ error } type="error" />;

  // Checks for existing data so loading doesn't flash when resort columns
  if ( loading && !data ) return <TableBodyMessage type="loading" />;

  if ( !data ) return null;
  if ( searchTerm && !data.length ) return <TableBodyMessage searchTerm={ searchTerm } type="no-results" />;
  if ( !data.length ) return <TableBodyMessage type="no-projects" />;

  // No option exisiting in schema to order by author
  // When author column is clicked, a query is sent to the server without pagination variables
  // This results in an overfetch that has to be filtered on the the client side
  const order = direction ? `${direction === 'ascending' ? 'asc' : 'desc'}` : 'desc';

  const authorSorting = orderBy(
    data,
    tableDatum => {
      const formattedTableDatum = tableDatum.author;

      return formattedTableDatum;
    },
    [order]
  );

  // skip & first query vars are used as start/end slice() params to paginate tableData on client
  const { skip, first } = bodyPaginationVars;
  const paginatedAuthorSorting = authorSorting.slice( skip, skip + first );

  const tableData = column === 'author' ? paginatedAuthorSorting : data;

  return (
    <Table.Body className="projects">
      { tableData.map( d => (
        <TableRow
          key={ d.id }
          d={ d }
          selectedItems={ selectedItems }
          tableHeaders={ tableHeaders }
          toggleItemSelection={ toggleItemSelection }
          projectTab={ projectTab }
          team={ team }
        />
      ) ) }
    </Table.Body>
  );
};

TableBody.propTypes = {
  bodyPaginationVars: PropTypes.object,
  column: PropTypes.string,
  data: PropTypes.array,
  error: PropTypes.object,
  loading: PropTypes.bool,
  searchTerm: PropTypes.string,
  selectedItems: PropTypes.object,
  tableHeaders: PropTypes.array,
  toggleItemSelection: PropTypes.func,
  direction: PropTypes.string,
  projectTab: PropTypes.string,
  team: PropTypes.object
};

export default TableBody;

