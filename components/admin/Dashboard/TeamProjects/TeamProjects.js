/**
 *
 * MyProjects
 *
 */
import React from 'react';
import ScrollableTableWithMenu from 'components/ScrollableTableWithMenu/ScrollableTableWithMenu';
import { useAuth } from 'context/authContext';

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
  const { user } = useAuth();
  const team = user?.team;

  if ( !team ) return null;

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
