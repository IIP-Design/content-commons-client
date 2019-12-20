/**
 *
 * TableItemsDisplay
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Dropdown, Grid, Loader } from 'semantic-ui-react';
import { getProjectsType, setProjectsQueries } from 'lib/graphql/util';
import ApolloError from 'components/errors/ApolloError';
import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from 'lib/graphql/queries/video';
import { TEAM_PACKAGES_COUNT_QUERY } from 'lib/graphql/queries/package';
import './TableItemsDisplay.scss';

const displaySizeOptions = [
  { key: 15, value: 15, text: '15' },
  { key: 25, value: 25, text: '25' },
  { key: 50, value: 50, text: '50' },
  { key: 75, value: 75, text: '75' },
  { key: 100, value: 100, text: '100' },
];

const TableItemsDisplay = props => {
  const {
    team,
    handleChange,
    searchTerm,
    value: count,
    variables,
    variables: { skip }
  } = props;

  // Determine type of dashboard projects
  const dashboardProjectsType = getProjectsType( team );

  // Determine which Query to run
  const graphQuery = setProjectsQueries( team, {
    videoProjects: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
    packages: TEAM_PACKAGES_COUNT_QUERY
  } );

  const { loading, error, data } = useQuery( graphQuery, {
    variables: { ...variables }
  } );

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

  const dashboardData = data[dashboardProjectsType];
  if ( !dashboardData ) return null;

  const projectsCount = dashboardData.length;
  const firstPageItem = skip + 1;
  const range = skip + count;
  const lastPageItem = range < projectsCount ? range : projectsCount;

  return (
    <Grid.Column className="items_display">
      <span>
        Show:{ ' ' }
        <Dropdown
          id="items-per-page"
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
};

TableItemsDisplay.propTypes = {
  team: PropTypes.object,
  handleChange: PropTypes.func,
  searchTerm: PropTypes.string,
  value: PropTypes.number,
  variables: PropTypes.object,
};

export default TableItemsDisplay;
