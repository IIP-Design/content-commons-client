import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Table } from 'semantic-ui-react';
import TableMobileDataToggleIcon from 'components/ScrollableTableWithMenu/TableMobileDataToggleIcon/TableMobileDataToggleIcon';

const MyProjectPrimaryCol = dynamic( () => import( 'components/admin/Dashboard/MyProjects/MyProjectPrimaryCol/MyProjectPrimaryCol' ) );
const TeamProjectPrimaryCol = dynamic( () => import( 'components/admin/Dashboard/TeamProjects/TeamProjectPrimaryCol/TeamProjectPrimaryCol' ) );

const TableRow = props => {
  const [displayMobileData, setDisplayMobileData] = useState( false );

  const handleDisplayMobileData = () => {
    setDisplayMobileData( prevDisplayMobileData => !prevDisplayMobileData );
  };

  const {
    d, selectedItems, tableHeaders, toggleItemSelection, projectTab
  } = props;

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
                      selectedItems={ selectedItems }
                      toggleItemSelection={ toggleItemSelection }
                    />
                  ) }
                  { projectTab === 'teamProjects' && (
                    <TeamProjectPrimaryCol
                      d={ d }
                      header={ header }
                      selectedItems={ selectedItems }
                      toggleItemSelection={ toggleItemSelection }
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
                  { d[header.name] }
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
  selectedItems: PropTypes.object,
  tableHeaders: PropTypes.array,
  toggleItemSelection: PropTypes.func,
  projectTab: PropTypes.string
};

export default TableRow;
