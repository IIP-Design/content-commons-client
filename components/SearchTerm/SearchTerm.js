import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { numberWithCommas } from 'lib/utils';
import styles from './SearchTerm.module.scss';

const SearchTerm = ( { search } ) => {
  const { currentTerm, total } = search;

  return (
    <section className={ styles.searchTerm }>
      <VisuallyHidden><h1>search results</h1></VisuallyHidden>
      <div className={ styles.searchTermQuery }>
        { currentTerm && `${currentTerm}` }
        <div className={ styles.searchTermTotal }>
          { `${numberWithCommas( total )} item${total === 1 ? '' : 's'}` }
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = state => ( {
  search: state.search,
} );

SearchTerm.propTypes = {
  search: object,
};

export default connect( mapStateToProps )( SearchTerm );
