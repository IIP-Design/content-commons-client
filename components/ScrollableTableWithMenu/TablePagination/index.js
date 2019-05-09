import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Pagination } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import './TablePagination.scss';

const TEAM_VIDEO_PROJECTS_COUNT_QUERY = gql`
  query VideoProjectsCountByTeam( $team: String!, $searchTerm: String ) {
    videoProjects(
      where: {
        AND: [
          { team: { name: $team } },
          {
            OR: [
              { projectTitle_contains: $searchTerm },
              { descPublic_contains: $searchTerm },
              { descInternal_contains: $searchTerm },
              {
                categories_some: {
                  translations_some: { name_contains: $searchTerm }
                }
              },
              {
                author: {
                  OR: [
                    { firstName_contains: $searchTerm },
                    { lastName_contains: $searchTerm },
                    { email_contains: $searchTerm }
                  ]
                }
              }
            ]
          }
        ]
      }
    ) {
      id
    }
  }
`;

const TablePagination = props => {
  const {
    activePage, handlePageChange, itemsPerPage, variables
  } = props;
  return (
    <Query
      query={ TEAM_VIDEO_PROJECTS_COUNT_QUERY }
      variables={ { ...variables } }
    >
      { ( { loading, error, data: { videoProjects } } ) => {
        if ( loading ) return 'Loading....';
        if ( error ) return <ApolloError error={ error } />;
        if ( !videoProjects ) return null;

        const projectsCount = videoProjects.length;
        const totalPages = Math.ceil( projectsCount / itemsPerPage );

        if ( projectsCount > 0 ) {
          return (
            <Pagination
              activePage={ activePage }
              totalPages={ totalPages }
              nextItem={ { content: 'Next >', disabled: activePage === totalPages } }
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
  variables: PropTypes.object
};

export default TablePagination;
export { TEAM_VIDEO_PROJECTS_COUNT_QUERY };
