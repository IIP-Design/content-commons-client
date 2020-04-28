import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Loader, Table } from 'semantic-ui-react';

import ApolloError from 'components/errors/ApolloError';

const setMessage = ( type, error, searchTerm ) => {
  switch ( type ) {
  case 'error':
    return <ApolloError error={ error } />;
  case 'loading':
    return (
      <Fragment>
        <Loader active inline size="small" />
        <span style={ { marginLeft: '0.5em', fontSize: '1.5em' } }>
          Loading...
        </span>
      </Fragment>
    );
  case 'no-projects':
    return 'No projects';
  case 'no-results':
    return `No results for &ldquo;${searchTerm}&rdquo;`;
  default:
    return '';
  }
};

const TableBodyMessage = ( { error, searchTerm, type } ) => {
  if ( type ) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            {setMessage( type, error, searchTerm ) }
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  return null;
};

TableBodyMessage.propTypes = {
  error: PropTypes.object,
  searchTerm: PropTypes.string,
  type: PropTypes.string
};

export default TableBodyMessage;
