import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Pagination } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import './TablePagination.scss';

const TEAM_VIDEO_PROJECTS_COUNT_QUERY = gql`
  query VideoProjectsCountByTeam( $team: String! ) {
    videoProjects(
      where: { team: { name: $team } }
     ) {
      id
    }
  }
`;

const TablePagination = props => {
  const {
    activePage, handlePageChange, itemsPerPage, team
  } = props;
  return (
    <Query query={ TEAM_VIDEO_PROJECTS_COUNT_QUERY } variables={ { team } }>
      { ( { loading, error, data: { videoProjects } } ) => {
        if ( loading ) return 'Loading....';
        if ( error ) return <ApolloError error={ error } />;
        if ( !videoProjects ) return null;

        const projectsCount = videoProjects.length;

        if ( itemsPerPage < projectsCount ) {
          return (
            <Pagination
              activePage={ activePage }
              totalPages={ projectsCount / itemsPerPage }
              nextItem={ { content: 'Next >', disabled: activePage === projectsCount } }
              prevItem={ { content: '< Previous', disabled: activePage === 1 } }
              siblingRange="2"
              firstItem={ null }
              lastItem={ null }
              onPageChange={ handlePageChange }
            />
          );
        }
        return null;
      } }
    </Query>
  );
};

TablePagination.propTypes = {
  activePage: PropTypes.number,
  handlePageChange: PropTypes.func,
  itemsPerPage: PropTypes.number,
  team: PropTypes.string
};

export default TablePagination;
