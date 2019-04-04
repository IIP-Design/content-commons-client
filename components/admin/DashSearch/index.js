/**
 *
 * DashSearch
 *
 */
import React from 'react';
import { Input } from 'semantic-ui-react';
// import PropTypes from 'prop-types';

import './DashSearch.css';
import Grid from 'semantic-ui-react/dist/es/collections/Grid/Grid';

/* eslint-disable react/prefer-stateless-function */
class DashSearch extends React.Component {
  render() {
    return (
      <Grid.Column floated="right" width={ 4 } className="dashSearch_wrapper">
        <Input action={ { icon: 'search' } } placeholder="search term" className="dashSearch__searchTerm" />
      </Grid.Column>
    );
  }
}

export default DashSearch;
