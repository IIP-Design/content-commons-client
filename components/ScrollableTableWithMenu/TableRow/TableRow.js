import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { formatDate } from 'lib/utils';
import { Table } from 'semantic-ui-react';
import TableMobileDataToggleIcon from 'components/ScrollableTableWithMenu/TableMobileDataToggleIcon/TableMobileDataToggleIcon';

const MyProjectPrimaryCol = dynamic( () => import(
  /* webpackChunkName: "myProjectPrimaryCol" */
  'components/admin/Dashboard/MyProjects/MyProjectPrimaryCol/MyProjectPrimaryCol'
) );

const TeamProjectPrimaryCol = dynamic( () => import(
  /* webpackChunkName: "teamProjectPrimaryCol" */
  'components/admin/Dashboard/TeamProjects/TeamProjectPrimaryCol/TeamProjectPrimaryCol'
) );

const TableRow = ( { d, tableHeaders, projectTab } ) => {
  const [displayMobileData, setDisplayMobileData] = useState( false );

  const handleDisplayMobileData = () => {
    setDisplayMobileData( prevDisplayMobileData => !prevDisplayMobileData );
  };

  if ( !d ) return null;

  return (
    <Table.Row
      className={ displayMobileData ? 'activeTableRow' : '' }
    >
      { tableHeaders.map( ( header, i ) => (
        <Table.Cell
          data-header={ header.label }
          key={ `${d.id}_${header.name}` }
          className={ `items_table_item${d.status === 'PUBLISHING' ? ' isPublishing' : ''}` }
        >
          { i === 0
            ? (
              // Table must include .primary_col div for fixed column
              <Fragment>
                <div className="primary_col">
                  { projectTab === 'myProjects' && (
                    <MyProjectPrimaryCol
                      d={ d }
                      header={ header }
                    />
                  ) }
                  { projectTab === 'teamProjects' && (
                    <TeamProjectPrimaryCol
                      d={ d }
                      header={ header }
                    />
                  ) }
                </div>
                <TableMobileDataToggleIcon
                  isOpen={ displayMobileData }
                  toggleDisplay={ handleDisplayMobileData }
                />
              </Fragment>
            )
            : (
              <Fragment>
                <span>
                  <div className="items_table_mobileHeader">{ header.label }</div>
                  {
                    header.name === 'createdAt' || header.name === 'updatedAt'
                      ? formatDate( d[header.name] )
                      : d[header.name]
                  }
                </span>
                <br />
                { header.label === 'CREATED'
                  ? <span>{ d.status }</span>
                  : null }
              </Fragment>
            ) }
        </Table.Cell>
      ) ) }
    </Table.Row>
  );
};

TableRow.propTypes = {
  d: PropTypes.object,
  tableHeaders: PropTypes.array,
  projectTab: PropTypes.string
};

export default TableRow;
