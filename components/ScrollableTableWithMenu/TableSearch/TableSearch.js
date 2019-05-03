import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Grid, Input
} from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import './TableSearch.scss';

const TableSearch = props => {
  const [searchTerm, setSearchTerm] = useState( '' );

  const { handleSearchSubmit } = props;

  const handleChange = ( e, { value } ) => setSearchTerm( value );

  const handleSubmit = e => handleSearchSubmit( e, searchTerm );

  const handleClear = e => {
    setSearchTerm( '' );
    handleSearchSubmit( e, '' );
  };

  return (
    <Grid.Column floated="right" mobile={ 16 } computer={ 6 } className="tableSearch_wrapper">
      <Form onSubmit={ handleSubmit } size="tiny">
        <VisuallyHidden>
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
  handleSearchSubmit: PropTypes.func
};

export default TableSearch;
