import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import IconPopup from 'components/popups/IconPopup/IconPopup';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import { UPDATE_SUPPORT_FILE_MUTATION, DELETE_SUPPORT_FILE_MUTATION } from 'lib/graphql/queries/common';
import { GRAPHIC_PROJECT_QUERY } from 'lib/graphql/queries/graphic';
import { getCount } from 'lib/utils';

const GraphicProjectSupportFiles = props => {
  const {
    projectId, headline, helperText, files
  } = props;
  const [deleteSupportFile] = useMutation( DELETE_SUPPORT_FILE_MUTATION );
  const [updateSupportFile] = useMutation( UPDATE_SUPPORT_FILE_MUTATION );

  const handleDelete = async id => {
    await deleteSupportFile( {
      variables: { id },
      refetchQueries: [
        {
          query: GRAPHIC_PROJECT_QUERY,
          variables: { id: projectId }
        }
      ]
    } ).catch( err => console.dir( err ) );
  };

  const handleLanguageChange = async ( e, { id, value } ) => {
    await updateSupportFile( {
      variables: {
        data: {
          language: {
            connect: {
              id: value
            }
          }
        },
        where: {
          id
        }
      }
    } ).catch( err => console.dir( err ) );
  };

  if ( !getCount( files ) ) {
    return <p>no files available</p>;
  }

  return (
    <div className={ `graphic-project-support-files ${headline.replace( ' ', '-' )}` }>
      <div className="heading" style={ { display: 'flex', alignItems: 'center' } }>
        <h3 style={ { marginRight: '0.625em', marginBottom: 0, textTransform: 'capitalize' } }>
          { headline }
        </h3>
        <IconPopup
          message={ helperText }
          iconSize="small"
          iconType="info circle"
          popupSize="mini"
        />
      </div>
      <ul style={ { listStyle: 'none', paddingLeft: 0, fontSize: '0.888888889rem' } }>
        { files.map( file => {
          const { id, filename } = file;

          return (
            <li key={ id }>
              <span>{ filename }</span>

              { headline.includes( 'editable' )
                && (
                  <LanguageDropdown
                    id={ id }
                    value={ file.language.id }
                    onChange={ handleLanguageChange }
                    required
                  />
                ) }

              <FileRemoveReplaceButtonGroup
                onRemove={ () => handleDelete( id ) }
              />
            </li>
          );
        } ) }
      </ul>
    </div>
  );
};

GraphicProjectSupportFiles.propTypes = {
  projectId: PropTypes.string,
  handleUpdate: PropTypes.func,
  headline: PropTypes.string,
  helperText: PropTypes.string,
  files: PropTypes.array
};

export default GraphicProjectSupportFiles;
