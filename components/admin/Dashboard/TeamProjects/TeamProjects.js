/**
 *
 * MyProjects
 *
 */
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from 'components/User/User';
import ScrollableTableWithMenu from 'components/ScrollableTableWithMenu/ScrollableTableWithMenu';

const persistentTableHeaders = [
  { name: 'projectTitle', label: 'PROJECT TITLE' },
  { name: 'createdAt', label: 'CREATED' },
  { name: 'visibility', label: 'VISIBILITY' },
  { name: 'author', label: 'AUTHOR' }
];

const menuItems = [
  { name: 'team', label: 'TEAM' },
  { name: 'categories', label: 'CATEGORIES' },
  { name: 'updatedAt', label: 'MODIFIED DATE' }
];

const TeamProjects = () => {
  const { loading, error, data } = useQuery( CURRENT_USER_QUERY );

  if ( loading ) return 'Loading...';
  if ( error ) return `Error! ${error.message}`;

  const { authenticatedUser: { team } } = data;

  return (
    <ScrollableTableWithMenu
      columnMenu={ menuItems }
      persistentTableHeaders={ persistentTableHeaders }
      team={ team }
      projectTab="teamProjects"
    />
  );
};

export default TeamProjects;
