/**
 *
 * MyProjects
 *
 */
import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CURRENT_USER_QUERY } from 'components/User/User';

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
  const { loading, error, data } = useQuery( CURRENT_USER_QUERY );

  if ( loading ) return 'Loading...';
  if ( error ) return `Error! ${error.message}`;

  const { authenticatedUser: { team } } = data;

  // If a team does not have any contentTypes associated with it then display message with links
  if ( !team.contentTypes.length ) return (
    <Fragment>
      <p>There aren't any team projects available to view.</p>
      <p>You can <Link href="/admin/upload" passHref><a className="linkStyle">upload a project</a></Link> or <Link href="/" passHref><a className="linkStyle">browse for other PD content</a></Link>.</p>
    </Fragment>    
  );

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
