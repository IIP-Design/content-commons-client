/**
 *
 * EditSupportFilesContent
 *
 */
import React from 'react';
import { func, object, string } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Button, Form, Table } from 'semantic-ui-react';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import VisuallyHidden from 'components/admin/projects/shared/VisuallyHidden/VisuallyHidden';
import EditSupportFileRow from 'components/admin/projects/ProjectEdit/EditSupportFileRow/EditSupportFileRow';

import { compareValues, capitalizeFirst } from 'lib/utils';

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

  getFilesByType = ( files, type ) => {
    /**
     * @todo Would be better to get file types from
     * a query. Need to figure out why these nested
     * arguments don't work:
     *
       query EditSupportFiles($id: ID!) {
        project: videoProject(id: $id) {
          srt: supportFiles(where: {filetype: "srt"}, orderBy: filename_ASC) {
            id
            filetype
            filename
          }
          other: supportFiles(where: {filetype_not: "srt"}, , orderBy: filetype_ASC) {
            id
            filetype
            filename
          }
        }
      }
     */
    if ( type === 'srt' ) {
      return files
        .filter( file => file.filetype === type )
        .sort( compareValues( 'filename' ) );
    }
    return files
      .filter( file => file.filetype !== 'srt' )
      .sort( compareValues( 'filetype' ) );
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
    const { id } = file;
    const {
      fileType,
      projectId,
      data: { project: { supportFiles } }
    } = this.props;

    /**
     * see @todo comment in the getFilesByType method
     */
    const files = this.getFilesByType( supportFiles, fileType );

    return (
      <EditSupportFileRow
        key={ id }
        file={ file }
        projectId={ projectId }
        fileExtensions={ this.getFileExtensions( files ) }
      />
    );
  }

  render() {
    if ( !this.props.data.project ) return null;

    const {
      fileType,
      data: {
        error,
        loading,
        project: { supportFiles }
      }
    } = this.props;

    /**
     * see @todo comment in the getFilesByType method
     */
    const files = this.getFilesByType( supportFiles, fileType );

    if ( loading ) return 'Loading the support files...';
    if ( error ) return `Error! ${error.message}`;
    if ( !files || !files.length ) return null;

    const headline = fileType === 'srt'
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
                <Table.HeaderCell width={ 9 }>
                  { `${headline} File${files.length > 1 ? 's' : ''} Selected` }
                </Table.HeaderCell>
                <Table.HeaderCell width={ 4 }>
                  Language
                  <small className="msg--required"> *</small>
                </Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            <Table.Body>
              { files.map( this.renderRow ) }
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
  closeEditModal: func
};

const SUPPORT_FILES_QUERY = gql`
  query SupportFiles($id: ID!) {
    project: videoProject(id: $id) {
      supportFiles {
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
`;

export default graphql( SUPPORT_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.projectId
    },
  } )
} )( EditSupportFilesContent );
export { SUPPORT_FILES_QUERY };
