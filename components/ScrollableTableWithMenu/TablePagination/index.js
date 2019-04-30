import React from 'react';
import PropTypes from 'prop-types';
import './TablePagination.scss';

import { Pagination } from 'semantic-ui-react';

class TablePagination extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      activePage: 1
    };
  }

  handlePageChange = ( e, { activePage } ) => this.setState( { activePage } );

  render() {
    const { activePage } = this.state;
    return (
      <Pagination
        activePage={ activePage }
        totalPages={ 20 }
        nextItem={ { content: 'Next ⟩', disabled: activePage === 20 } }
        prevItem={ { content: '⟨ Previous', disabled: activePage === 1 } }
        siblingRange="2"
        firstItem={ null }
        lastItem={ null }
        onPageChange={ this.handlePageChange }
      />
    );
  }
}

// TablePagination.propTypes = {
//   dashSearch: object
//   targetRequest: func
// };

export default TablePagination;
