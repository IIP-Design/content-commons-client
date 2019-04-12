/**
 *
 * EditSupportFilesContent
 *
 */
import React from 'react';
import { func, object, string } from 'prop-types';
import gql from 'graphql-tag';
import orderBy from 'lodash/orderBy';
import {
  Button, Form, Loader, Table
} from 'semantic-ui-react';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import EditSupportFileRow from 'components/admin/projects/ProjectEdit/EditSupportFileRow/EditSupportFileRow';
import graphqlDynamicHOC from 'components/admin/graphqlDynamicHOC/graphqlDynamicHOC';

import { capitalizeFirst } from 'lib/utils';

import './EditSupportFilesContent.scss';

/* eslint-disable react/prefer-stateless-function */
class EditSupportFilesContent extends React.PureComponent {
  getFileExtension = str => (
    str.slice( ( Math.max( 0, str.lastIndexOf( '.' ) ) || Infinity ) )
  )

  getFileExtensions = arr => {
    const allFileExtensions = arr.reduce( ( acc, curr ) => (
      acc.concat( this.getFileExtension( curr.filename ) )
    ), [] );
    const uniqueExtensions = [...new Set( allFileExtensions )];
    return uniqueExtensions;
  }

  handleCancelClose = () => {
    console.log( 'cancel' );
    this.props.closeEditModal();
  }

  handleAddFiles = () => {
    console.log( 'add files' );
    this.addFilesInputRef.click();
  }

  handleAddFilesRef = input => {
    this.addFilesInputRef = input;
  }

  renderRow = file => {
    const {
      orderByField,
      projectId,
      data: { project: { files } }
    } = this.props;

    return (
      <EditSupportFileRow
        key={ file.id }
        file={ file }
        orderByField={ orderByField }
        projectId={ projectId }
        fileExtensions={ this.getFileExtensions( files ) }
      />
    );
  }

  render() {
    if ( !this.props.data.project ) return null;

    const {
      fileType,
      data,
      data: { project: { files } }
    } = this.props;

    const isSrt = fileType === 'srt';

    if ( data.loading ) {
      return (
        <div
          className="edit-support-files-loader"
          style={ {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px'
          } }
        >
          <Loader
            active
            inline="centered"
            style={ { marginBottom: '1em' } }
          />
          <p>Loading support file(s)...</p>
        </div>
      );
    }

    if ( data.error ) return `Error! ${data.error.message}`;

    if ( !files || !files.length ) return null;

    const sortedFiles = orderBy( files, ['filetype'] );

    const headline = isSrt
      ? fileType.toUpperCase()
      : capitalizeFirst( fileType );

    return (
      <ModalItem
        className={ `edit-support-files ${fileType}` }
        headline={ `Edit ${headline} file${files.length > 1 ? 's' : ''} in this project` }
        textDirection="ltr"
      >
        <Form>
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={ isSrt ? 9 : 7 }>
                  { `${headline} File${files.length > 1 ? 's' : ''} Selected` }
                </Table.HeaderCell>
                <Table.HeaderCell width={ 4 }>
                  Language
                  <small className="msg--required"> *</small>
                </Table.HeaderCell>

                { !isSrt
                  && (
                    <Table.HeaderCell width={ 4 }>
                      Type/Use
                      <small className="msg--required"> *</small>
                    </Table.HeaderCell>
                  ) }

                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { sortedFiles.map( this.renderRow ) }
            </Table.Body>
          </Table>

          <div className="btn-group">
            <Button
              className="cancel-close"
              content="Cancel"
              basic
              size="tiny"
              onClick={ this.handleCancelClose }
              type="button"
            />
            <Button
              className="add-files"
              content="Add Files"
              color="blue"
              basic
              size="tiny"
              onClick={ this.handleAddFiles }
              type="button"
            />
            <VisuallyHidden>
              { /* eslint-disable jsx-a11y/label-has-for */
                /* eslint-disable jsx-a11y/label-has-associated-control */ }
              <label htmlFor="upload-file--multiple">upload files</label>
              <input
                id="upload-file--multiple"
                ref={ this.handleAddFilesRef }
                type="file"
                multiple
                tabIndex={ -1 }
              />
            </VisuallyHidden>
          </div>
        </Form>
      </ModalItem>
    );
  }
}

EditSupportFilesContent.propTypes = {
  data: object.isRequired,
  projectId: string.isRequired,
  fileType: string,
  orderByField: string,
  closeEditModal: func
};

const SUPPORT_FILES_QUERY = props => (
  gql`
    query SupportFiles($id: ID!, $fileType: String!, $orderBy: SupportFileOrderByInput) {
      project: videoProject(id: $id) {
        files: supportFiles(
          where: { ${props.orderByField}: $fileType }
          orderBy: $orderBy
        ) {
          id
          filename
          filetype
          language {
            id
            displayName
          }
        }
      }
    }
  `
);

export default graphqlDynamicHOC( SUPPORT_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.projectId,
      fileType: 'srt',
      orderBy: 'filename_ASC'
    }
  } )
} )( EditSupportFilesContent );

export { SUPPORT_FILES_QUERY };
