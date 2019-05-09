import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Loader } from 'semantic-ui-react';

import FileSidebar from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalSections/FileSidebar/FileSidebar';
import FileDataForm from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalForms/FileDataForm/FileDataForm';
import { EditSingleProjectItemContext } from 'components/admin/projects/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';

import './FileSection.scss';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    unit: videoUnit( id: $id ) {
      id
      files {
        id
      }
      language {
        id
        displayName
      }
    }
  } 
`;

const FileSection = () => (
  <EditSingleProjectItemContext.Consumer>
    { ( {
      language, selectedFile, selectedUnit, updateLanguage, updateFile
    } ) => (
      <Query query={ VIDEO_UNIT_QUERY } variables={ { id: selectedUnit } }>
        { ( { loading, error, data } ) => {
          if ( error ) return 'Error!';
          if ( loading || !data ) {
            return (
              <div style={ {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                justifyContent: 'center'
              } }
              >
                <Loader active inline="centered" style={ { marginBottom: '1em' } } />
                <p>Loading the file data...</p>
              </div>
            );
          }

          const { unit } = data;
          const lang = unit && unit.language && unit.language.displayName ? unit.language.displayName : '';
          // const initialFile = unit && unit.files && unit.files[0] ? unit.files[0].id : '';

          updateLanguage( lang );
          // updateFile( initialFile );

          return (
            <section className="edit-file">
              <h4>{ `File Data ${language ? `in ${language}` : ''}` }</h4>
              <div className="edit-file-form-container">
                <FileSidebar />
                <FileDataForm id={ selectedFile } />
              </div>
            </section>
          );
        } }
      </Query>
    ) }
  </EditSingleProjectItemContext.Consumer>
);

export default FileSection;
