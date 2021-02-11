import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Grid, Input,
} from 'semantic-ui-react';

import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';

import './TableSearch.scss';

const TableSearch = ( { handleSearchSubmit } ) => {
  const [searchTerm, setSearchTerm] = useState( '' );
  const [hasActiveSearch, setHasActiveSearch] = useState( false );

  const handleClear = e => {
    setSearchTerm( '' );
    setHasActiveSearch( false );
    handleSearchSubmit( e, '' );
  };

  const handleChange = ( e, { value } ) => {
    if ( hasActiveSearch && value === '' ) {
      handleClear( e );
    }
    setSearchTerm( value );
  };

  const handleSubmit = e => {
    setHasActiveSearch( true );
    handleSearchSubmit( e, searchTerm );
  };

  return (
    <Grid.Column floated="right" mobile={ 16 } computer={ 6 } className="tableSearch_wrapper">
      <Form onSubmit={ handleSubmit } size="tiny">
        <VisuallyHidden>
          { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
          <label htmlFor="search-projects">Search projects</label>
        </VisuallyHidden>
        <Input
          action
          className="tableSearch__searchTerm"
          fluid
          id="search-projects"
          onChange={ handleChange }
          placeholder="search term"
          value={ searchTerm }
        >
          <input />
          { searchTerm
            && (
              <Button
                aria-label="clear search"
                basic
                className="clear"
                type="button"
                icon="delete"
                onClick={ handleClear }
              />
            ) }
          <Button aria-label="search" icon="search" />
        </Input>
      </Form>
    </Grid.Column>
  );
};

TableSearch.propTypes = {
  handleSearchSubmit: PropTypes.func,
};

export default TableSearch;
