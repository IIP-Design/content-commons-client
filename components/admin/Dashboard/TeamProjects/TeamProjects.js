/**
 *
 * MyProjects
 *
 */
import React, { Fragment } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from 'context/authContext';

const ScrollableTableWithMenu = dynamic( () => import( 'components/ScrollableTableWithMenu/ScrollableTableWithMenu' ) );

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

  // If a team does not have any contentTypes associated with it then display message with links
  if ( !team.contentTypes.length ) {
    return (
      <Fragment>
        <p>There aren't any team projects available to view.</p>
        <p>You can <Link href="/admin/upload" passHref><a className="linkStyle">upload a project</a></Link> or <Link href="/" passHref><a className="linkStyle">browse for other PD content</a></Link>.</p>
      </Fragment>
    );
  }

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
