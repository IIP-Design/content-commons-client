import React from 'react';
import { Input, Grid } from 'semantic-ui-react';
import './TableSearch.scss';

const TableSearch = () => (
  <Grid.Column floated="right" width={ 5 } className="tableSearch_wrapper">
    <Input action={ { icon: 'search' } } placeholder="search term" className="tableSearch__searchTerm" />
  </Grid.Column>
);

export default TableSearch;
