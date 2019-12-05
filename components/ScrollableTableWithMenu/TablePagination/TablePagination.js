import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Pagination } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from 'lib/graphql/queries/video';
import { TEAM_PACKAGES_COUNT_QUERY } from 'lib/graphql/queries/package';
import './TablePagination.scss';

const TablePagination = props => {
  const {
    activePage, handlePageChange, itemsPerPage, variables, team
  } = props;

  // Determine type of dashboard projects
  const getDashboardProjectsType = () => {
    let projectsType;
    const { contentTypes } = team;
    if ( contentTypes.includes( 'VIDEO' ) ) projectsType = 'videoProjects';
    if ( contentTypes.includes( 'PACKAGE' ) ) projectsType = 'packages';
    return projectsType || null;
  };
  const dashboardProjectsType = getDashboardProjectsType();

  // Determine which Query to run
  const setGraphQuery = () => {
    let query;
    const { contentTypes } = team;
    if ( contentTypes.includes( 'VIDEO' ) ) query = TEAM_VIDEO_PROJECTS_COUNT_QUERY;
    if ( contentTypes.includes( 'PACKAGE' ) ) query = TEAM_PACKAGES_COUNT_QUERY;
    return query;
  };
  const graphQuery = setGraphQuery();

  const { loading, error, data } = useQuery( graphQuery, {
    variables: { ...variables },
    fetchPolicy: 'cache-and-network'
  } );

  if ( loading ) return 'Loading....';
  if ( error ) return <ApolloError error={ error } />;

  const dashboardData = data[dashboardProjectsType];
  if ( !dashboardData ) return null;

  const projectsCount = dashboardData.length;
  const totalPages = Math.ceil( projectsCount / itemsPerPage );

  if ( projectsCount > 0 && totalPages > 1 ) {
    return (
      <Pagination
        activePage={ activePage }
        totalPages={ totalPages }
        nextItem={ { content: 'Next ⟩', disabled: activePage === totalPages } }
        prevItem={ { content: '⟨ Previous', disabled: activePage === 1 } }
        siblingRange="2"
        firstItem={ null }
        lastItem={ null }
        onPageChange={ handlePageChange }
      />
    );
  }

  return null;
};

TablePagination.propTypes = {
  team: PropTypes.object,
  activePage: PropTypes.number,
  handlePageChange: PropTypes.func,
  itemsPerPage: PropTypes.number,
  variables: PropTypes.object
};

export default TablePagination;
export { TEAM_VIDEO_PROJECTS_COUNT_QUERY };
