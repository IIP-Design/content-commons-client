/**
 *
 * TableActionsMenu
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Checkbox } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import editIcon from 'static/images/dashboard/edit.svg';
import createIcon from 'static/images/dashboard/create.svg';
import deleteIcon from 'static/images/dashboard/delete.svg';
import archiveIcon from 'static/images/dashboard/archive.svg';
import unpublishIcon from 'static/images/dashboard/unpublish.svg';
import './TableActionsMenu.scss';

const UNPUBLISH_VIDEO_PROJECTS_MUTATION = gql`
  mutation UnpublishManyVideoProjects(
    $data: VideoProjectUpdateManyMutationInput!,
    $where: VideoProjectWhereInput) {
    unpublish: updateManyVideoProjects(data: $data, where: $where) {
      count
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
class TableActionsMenu extends React.Component {
  handleUnpublish = unpublishFn => {
    const { selectedItems } = this.props;
    unpublishFn( {
      variables: {
        data: { status: 'DRAFT', visibility: 'INTERNAL' },
        where: {
          AND: [
            { id_in: [...selectedItems.keys()] },
            { status_not: 'DRAFT' }
          ]
        }
      }
    } );
  }

  render() {
    const { displayActionsMenu, toggleAllItemsSelection } = this.props;

    return (
      <div className="actionsMenu_wrapper">
        <Checkbox
          className={ displayActionsMenu ? 'actionsMenu_toggle actionsMenu_toggle--active' : 'actionsMenu_toggle' }
          onChange={ toggleAllItemsSelection }
        />
        <div className={ displayActionsMenu ? 'actionsMenu active' : 'actionsMenu' }>
          <Button size="mini" basic>
            <img src={ editIcon } alt="Edit Selection(s)" title="Edit Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ deleteIcon } alt="Delete Selection(s)" title="Delete Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ unpublishIcon } alt="Unpublish Selection(s)" title="Unpublish Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ createIcon } alt="Create Selection(s)" title="Create Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ archiveIcon } alt="Archive Selection(s)" title="Archive Selection(s)" />
          </Button>

          <span className="separator">|</span>

          <Mutation mutation={ UNPUBLISH_VIDEO_PROJECTS_MUTATION }>
            { ( unpublish, { error } ) => {
              if ( error ) return <ApolloError error={ error } />;
              return (
                <Button
                  className="unpublish"
                  size="mini"
                  basic
                  onClick={
                    () => this.handleUnpublish( unpublish )
                  }
                >
                  <span className="unpublish--text">Unpublish</span>
                </Button>
              );
            } }
          </Mutation>
        </div>
      </div>
    );
  }
}

TableActionsMenu.propTypes = {
  displayActionsMenu: PropTypes.bool,
  selectedItems: PropTypes.object,
  toggleAllItemsSelection: PropTypes.func
};

export default TableActionsMenu;
