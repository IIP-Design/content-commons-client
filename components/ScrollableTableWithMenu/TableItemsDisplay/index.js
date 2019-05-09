/**
 *
 * TableItemsDisplay
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Dropdown, Grid, Loader } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from '../TablePagination';
import './TableItemsDisplay.scss';

const displaySizeOptions = [
  { key: 2, value: 2, text: '2' }, // temp value, for development
  { key: 4, value: 4, text: '4' }, // temp value, for development
  { key: 25, value: 25, text: '25' },
  { key: 50, value: 50, text: '50' },
  { key: 75, value: 75, text: '75' },
  { key: 100, value: 100, text: '100' },
];

const TableItemsDisplay = props => {
  const {
    handleChange,
    searchTerm,
    value: count,
    variables,
    variables: { skip }
  } = props;

  return (
    <Query
      query={ TEAM_VIDEO_PROJECTS_COUNT_QUERY }
      variables={ { ...variables } }
    >
      { ( { loading, error, data: { videoProjects } } ) => {
        if ( loading ) {
          return (
            <Grid.Column className="items_display">
              <Loader active inline size="mini" />
              <span>Loading...</span>
            </Grid.Column>
          );
        }
        if ( error ) {
          return (
            <Grid.Column className="items_display">
              <ApolloError error={ error } />
            </Grid.Column>
          );
        }
        if ( !videoProjects ) return null;

        const projectsCount = videoProjects.length;
        const firstPageItem = skip + 1;
        const range = skip + count;
        const lastPageItem = range < projectsCount ? range : projectsCount;

        return (
          <Grid.Column className="items_display">
            <span>
              Show:{ ' ' }
              <Dropdown
                inline
                options={ displaySizeOptions }
                value={ count }
                onChange={ ( e, { value } ) => handleChange( e, value ) }
              />
              { ' | ' }
              { projectsCount > 0
                ? <span>{ firstPageItem } - { lastPageItem } of { projectsCount }{ searchTerm && <Fragment> for &ldquo;{ searchTerm }&rdquo;</Fragment> }</span>
                : <span>No { searchTerm ? 'results' : 'projects' }{ searchTerm && <Fragment> for &ldquo;{ searchTerm }&rdquo;</Fragment> }</span> }
            </span>
          </Grid.Column>
        );
      } }
    </Query>
  );
};

TableItemsDisplay.propTypes = {
  handleChange: PropTypes.func,
  searchTerm: PropTypes.string,
  value: PropTypes.number,
  variables: PropTypes.object,
};

export default TableItemsDisplay;
