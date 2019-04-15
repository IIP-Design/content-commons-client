import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown';
import VideoBurnedInStatusDropdown from 'components/admin/dropdowns/VideoBurnedInStatusDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown';
import QualityDropdown from 'components/admin/dropdowns/QualityDropdown';
import FileRemoveReplaceMenu from 'components/admin/FileRemoveReplaceMenu/FileRemoveReplaceMenu';

import { truncateAndReplaceStr } from 'lib/utils';
import UploadCompletionTracker from '../UploadCompletionTracker';
import { VideoUploadContext } from '../../VideoUpload';
import './VideoProjectFilesRowMobile.scss';

const VideoProjectFilesRowMobile = props => {
  const {
    file: {
      id, language, videoBurnedInStatus, use, quality, fileInput: { name, type }
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
      { ( { replaceAssetFile, removeAssetFile, updateField } ) => (
        <Form className="videoProjectFilesRowMobile">

          { /* Filename */ }
          <div className="videoProjectFilesRowMobile__column">
            <div className="videoProjectFilesRowMobile__column--filename">
              <UploadCompletionTracker fields={ getFields() } />
              <span className="item-text">{ filename }</span>
              <Button icon="chevron down" className={ `${open} no-background` } onClick={ handleToggleDropdowns } />
              <FileRemoveReplaceMenu
                onReplace={ e => replaceAssetFile( id, e.target.files[0] ) }
                onRemove={ () => removeAssetFile( id ) }
              />
            </div>
          </div>
          <div className={ `videoProjectFilesRowMobile__dropdowns ${toggleState}` }>
            <p className="videoProjectFilesRowMobile__dropdowns--filename-full">{ name }</p>

            { /* Language */ }
            <Form.Field required>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <VisuallyHidden>
                <label className="videoProjectFilesRowMobile__label" htmlFor={ id }>
                  { `${name} language` }
                </label>
              </VisuallyHidden>
              <LanguageDropdown id={ id } selected={ language } forFn={ name } onChange={ updateField } />
            </Form.Field>

            { /* VideoBurnedInStatus */ }

            { fileType === 'video' && (
              <Form.Field required>
                { /* eslint-disable jsx-a11y/label-has-for */ }
                <VisuallyHidden>
                  <label className="videoProjectFilesRowMobile__label" htmlFor={ id }>
                    { `${name} subtitles` }
                  </label>
                </VisuallyHidden>
                <VideoBurnedInStatusDropdown id={ id } selected={ videoBurnedInStatus } forFn={ name } onChange={ updateField } />
              </Form.Field>
            )
            }

            { /* Type/Use */ }

            { ( fileType === 'video' || fileType === 'image' ) && (
              <Form.Field required>
                { /* eslint-disable jsx-a11y/label-has-for */ }
                <VisuallyHidden>
                  <label className="videoProjectFilesRowMobile__label" htmlFor={ id }>
                    { `${name} type/use` }
                  </label>
                </VisuallyHidden>
                <UseDropdown id={ id } type={ fileType } selected={ use } forFn={ name } onChange={ updateField } />
              </Form.Field>
            )
            }

            { /* Quality */ }

            { fileType === 'video' && (
              <Form.Field required>
                { /* eslint-disable jsx-a11y/label-has-for */ }
                <VisuallyHidden>
                  <label className="videoProjectFilesRowMobile__label" htmlFor={ id }>
                    { `${name} quality` }
                  </label>
                </VisuallyHidden>
                <QualityDropdown id={ id } type={ fileType } selected={ quality } forFn={ name } onChange={ updateField } />
              </Form.Field>
            )
            }

          </div>
        </Form>
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
    fileInput: PropTypes.object
  } )
};

export default VideoProjectFilesRowMobile;
