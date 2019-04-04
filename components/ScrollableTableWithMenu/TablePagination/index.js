import React, { Component } from 'react';
// import { object, func } from 'prop-types';
// import { connect } from 'react-redux';
// import * as actions from '../../../actions/search';
import './TablePagination.css';

import { Pagination } from 'semantic-ui-react';

class TablePagination extends Component {
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

// const mapStateToProps = state => ( {
//   dashSearch: state.dashSearch
// } );

// TablePagination.propTypes = {
//   dashSearch: object
//   targetRequest: func
// };

// export default connect( mapStateToProps, actions )( TablePagination );
export default TablePagination;
