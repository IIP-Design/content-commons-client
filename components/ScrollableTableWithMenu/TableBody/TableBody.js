import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import orderBy from 'lodash/orderBy';
import { getLangTaxonomies } from 'lib/utils';
import { getProjectsType, setProjectsQueries, setProjectTitle } from 'lib/graphql/util';
import { TEAM_VIDEO_PROJECTS_QUERY } from 'lib/graphql/queries/video';
import { TEAM_PACKAGES_QUERY } from 'lib/graphql/queries/package';
import { Table } from 'semantic-ui-react';
import TableRow from 'components/ScrollableTableWithMenu/TableRow/TableRow';
import TableBodyLoading from './TableBodyLoading';
import TableBodyError from './TableBodyError';
import TableBodyNoResults from './TableBodyNoResults';
import TableBodyNoProjects from './TableBodyNoProjects';
import './TableBody.scss';

const normalizeTypesData = type => {
  const thumbnail = () => {
    if ( !type.thumbnails ) return {};

    return {
      signedUrl: type.thumbnails && type.thumbnails.length ? type.thumbnails[0].signedUrl : '',
      alt: type.thumbnails && type.thumbnails.length ? type.thumbnails[0].alt : ''
    };
  };

  const normalizedTypeData = Object.create( {}, {
    __typename: { value: type.__typename },
    id: { value: type.id },
    createdAt: { value: type.createdAt },
    updatedAt: { value: type.updatedAt },
    projectTitle: { value: setProjectTitle( type ) },
    author: { value: `${type.author ? type.author.firstName : ''} ${type.author ? type.author.lastName : ''}` },
    team: { value: type.team ? type.team.name : '' },
    status: { value: type.status || '' },
    visibility: { value: type.visibility },
    thumbnail: { value: thumbnail() },
    categories: { value: getLangTaxonomies( type.categories ) }
  } );

  return normalizedTypeData;
};

const normalizeDashboardData = types => {
  const normalizedProjects = [];

  types.forEach( type => normalizedProjects.push( normalizeTypesData( type ) ) );

  return normalizedProjects;
};

const TableBody = props => {
  const {
    bodyPaginationVars,
    column,
    direction,
    searchTerm,
    selectedItems,
    tableHeaders,
    toggleItemSelection,
    variables,
    projectTab,
    team
  } = props;

  // Determine type of dashboard projects
  const dashboardProjectsType = getProjectsType( team );

  // Determine which Query to run
  const graphQuery = setProjectsQueries( team, {
    videoProjects: TEAM_VIDEO_PROJECTS_QUERY,
    packages: TEAM_PACKAGES_QUERY
  } );

  // Run Query
  const {
    loading, error, data
  } = useQuery( graphQuery, {
    variables: column === 'author' ? { ...variables } : { ...variables, ...bodyPaginationVars },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  } );

  if ( error ) return <TableBodyError error={ error } />;
  // Checks for existing data so loading doesn't flash when resort columns
  if ( loading && !data ) return <TableBodyLoading />;

  // Set dashboard projects data & ID's for status subscription
  const setDashboardProjectsData = () => {
    let projectsData;

    if ( dashboardProjectsType === 'videoProjects' ) projectsData = data.videoProjects;
    if ( dashboardProjectsType === 'packages' ) projectsData = data.packages;

    return projectsData || null;
  };

  const dashboardProjects = setDashboardProjectsData();

  if ( !dashboardProjects ) return null;
  if ( searchTerm && !dashboardProjects.length ) return <TableBodyNoResults searchTerm={ searchTerm } />;
  if ( !dashboardProjects.length ) return <TableBodyNoProjects />;

  const normalized = normalizeDashboardData( dashboardProjects );

  // No option exisiting in schema to order by author
  // When author column is clicked, a query is sent to the server without pagination variables
  // This results in an overfetch that has to be filtered on the the client side
  const order = direction ? `${direction === 'ascending' ? 'asc' : 'desc'}` : 'desc';

  const authorSorting = orderBy(
    normalized,
    tableDatum => {
      const formattedTableDatum = tableDatum.author;

      return formattedTableDatum;
    },
    [order]
  );

  // skip & first query vars are used as start/end slice() params to paginate tableData on client
  const { skip, first } = bodyPaginationVars;
  const paginatedAuthorSorting = authorSorting.slice( skip, skip + first );

  const tableData = column === 'author' ? paginatedAuthorSorting : normalized;

  return (
    <Table.Body className="projects">
      { tableData.map( d => (
        <TableRow
          key={ d.id }
          d={ d }
          selectedItems={ selectedItems }
          tableHeaders={ tableHeaders }
          toggleItemSelection={ toggleItemSelection }
          projectTab={ projectTab }
          team={ team }
        />
      ) ) }
    </Table.Body>
  );
};

TableBody.propTypes = {
  bodyPaginationVars: PropTypes.object,
  column: PropTypes.string,
  searchTerm: PropTypes.string,
  selectedItems: PropTypes.object,
  tableHeaders: PropTypes.array,
  toggleItemSelection: PropTypes.func,
  variables: PropTypes.object,
  direction: PropTypes.string,
  projectTab: PropTypes.string,
  team: PropTypes.object
};

export default TableBody;

