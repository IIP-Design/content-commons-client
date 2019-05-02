import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Input } from 'semantic-ui-react';
import './TableSearch.scss';

const TableSearch = props => {
  const [searchTerm, setSearchTerm] = useState( '' );

  const { handleSearchSubmit } = props;

  const handleChange = ( e, { value } ) => setSearchTerm( value );

  const handleSubmit = e => handleSearchSubmit( e, searchTerm );

  return (
    <Grid.Column floated="right" width={ 5 } className="tableSearch_wrapper">
      <Form onSubmit={ handleSubmit } size="tiny">
        <Input
          action={ { icon: 'search' } }
          className="tableSearch__searchTerm"
          fluid
          onChange={ handleChange }
          placeholder="search term"
          value={ searchTerm }
        />
      </Form>
    </Grid.Column>
  );
};

TableSearch.propTypes = {
  handleSearchSubmit: PropTypes.func
};

export default TableSearch;
