import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown';
import VideoBurnedInStatusDropdown from 'components/admin/dropdowns/VideoBurnedInStatusDropdown/VideoBurnedInStatusDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown';
import QualityDropdown from 'components/admin/dropdowns/QualityDropdown/QualityDropdown';
import FileRemoveReplaceMenu from 'components/admin/FileRemoveReplaceMenu/FileRemoveReplaceMenu';
import { truncateAndReplaceStr } from 'lib/utils';
import UploadCompletionTracker from '../UploadCompletionTracker';
import { VideoUploadContext } from '../../VideoUpload';
import './VideoProjectFilesRowMobile.scss';

// Optimize re-renders as component could potentially have many rows
const areEqual = ( prevProps, nextProps ) => {
  const nextFile = nextProps.file;

  // if on same step, check for prop differences
  const entries = Object.entries( prevProps.file );
  const same = entries.every( ( [prop, value] ) => {
    if ( prop === 'id' || prop === 'input' ) {
      return true;
    }
    return nextFile[prop] === value;
  } );
  return same;
};


const VideoProjectFilesRowMobile = props => {
  const {
    file: {
      id, language, videoBurnedInStatus, use, quality, input: { name, type }
    }
  } = props;

  // extract file type, i.e. get 'image' from the incoming type 'image/*' for exaample
  // item in first index shows the first capturing group in regex
  let fileType = /(\w+)\/(\w+)/.exec( type );
  fileType = ( fileType ) ? fileType[1] : '';
  const filename = ( name.length > 30 ) ? truncateAndReplaceStr( name, 18, 8 ) : name;

  /**
   * Figure out how many fields need to be tracked for each filetype
   */
  const getFields = () => {
    switch ( fileType ) {
      case 'video':
        return [language, videoBurnedInStatus, use, quality];
      case 'image':
        return [language, use];
      default:
        return [language];
    }
  };

  // Are dropdowns showing?
  const [toggleState, setToggleState] = useState( 'hide' );

  // Is chevron up or down based on dropdown visiblity
  const [open, setOpen] = useState( '' );

  /**
   * Hide/show dropdowns
   */
  const handleToggleDropdowns = () => {
    setToggleState( () => ( toggleState === 'hide' ? 'show' : 'hide' ) );
    setOpen( () => ( open === 'open' ? '' : 'open' ) );
  };

  return (
    // Context API is used to avoind having to pass props down multiple levels
    <VideoUploadContext.Consumer>
      { ( {
        removeAssetFile,
        updateField,
        accept
      } ) => (
        <div className="videoProjectFilesRowMobile">

          { /* Filename */ }
          <div className="videoProjectFilesRowMobile__column">
            <div className="videoProjectFilesRowMobile__column--filename">
              <UploadCompletionTracker fields={ getFields() } />
              { /* eslint-disable jsx-a11y/interactive-supports-focus */ }
              <span
                className="item-text"
                role="button"
                onClick={ handleToggleDropdowns }
                onKeyPress={ handleToggleDropdowns }
              >
                { filename }
              </span>
              <Button
                icon="chevron down"
                className={ `${open} no-background` }
                onClick={ () => { handleToggleDropdowns(); } }
              />
              <FileRemoveReplaceMenu
                onRemove={ () => removeAssetFile( id ) }
                accept={ accept }
              />
            </div>
          </div>
          <div className={ `videoProjectFilesRowMobile__dropdowns ${toggleState}` }>
            <p className="videoProjectFilesRowMobile__dropdowns--filename-full">{ name }</p>

            { /* Language */ }
            <LanguageDropdown id={ id } label="Language" value={ language } onChange={ updateField } required />

            { /* VideoBurnedInStatus */ }
            { fileType === 'video' && (
            <VideoBurnedInStatusDropdown id={ id } label="Subtitles" value={ videoBurnedInStatus } onChange={ updateField } />
            )
            }

            { /* Type/Use */ }
            { ( fileType === 'video' || fileType === 'image' ) && (
            <UseDropdown id={ id } label="Type/Use" value={ use } type={ fileType } onChange={ updateField } required />
            )
            }

            { /* Quality */ }
            { fileType === 'video' && (
              <QualityDropdown
                id={ id }
                label="Quality"
                value={ quality }
                type={ fileType }
                onChange={ updateField }
                required
              />
            ) }
          </div>
        </div>
      ) }
    </VideoUploadContext.Consumer>
  );
};


VideoProjectFilesRowMobile.propTypes = {
  file: PropTypes.shape( {
    id: PropTypes.string,
    language: PropTypes.string,
    videoBurnedInStatus: PropTypes.string,
    use: PropTypes.string,
    quality: PropTypes.string,
    input: PropTypes.object
  } )
};


export default React.memo( VideoProjectFilesRowMobile, areEqual );
