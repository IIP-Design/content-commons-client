import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown';
import VideoBurnedInStatusDropdown from 'components/admin/dropdowns/VideoBurnedInStatusDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown';
import QualityDropdown from 'components/admin/dropdowns/QualityDropdown';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import { truncateAndReplaceStr } from 'lib/utils';
import UploadCompletionTracker from '../UploadCompletionTracker';
import './VideoProjectFilesRowDesktop.scss';
import { UploadFilesContext } from '../../../../UploadFilesContext';

const VideoProjectFilesDesktopRow = props => {
  const { replaceFile, removeFile, updateField } = useContext( UploadFilesContext );

  const {
    show, activeStep, file: {
      id, language, videoBurnedInStatus, use, quality, fileInput: { name, type }
    }
  } = props;

  // extract file type, i.e. get 'image' from the incoming type 'image/*' for example
  // item in first index shows the first capturing group in regex
  let fileType = /(\w+)\/(\w+)/.exec( type );
  fileType = ( fileType ) ? fileType[1] : '';
  const filename = ( name.length > 25 ) ? truncateAndReplaceStr( name, 15, 8 ) : name;

  /**
   * Figure out how many dropdowns need to be tracked for completion for each step
   * @param {number} step active step
   */
  const getFields = step => {
    if ( step === 1 ) {
      switch ( fileType ) {
        case 'video':
          return [language, videoBurnedInStatus];
        default:
          return [language];
      }
    } else {
      switch ( fileType ) {
        case 'video':
          return [use, quality];
        default:
          return [];
      }
    }
  };

  /**
   * Toggles trackers display based on activeStep
   * Not using show() as need to use !important in css rule
   * @param {number} step current step
   */
  const displayTracker = step => ( activeStep === step ? 'show' : 'hide' );

  const renderNotApplicable = () => (
    <div className="videoProjectFilesDesktopRow__column--not-applicable">
      Not Applicable
    </div>
  );

  return (
    <Grid.Row className="videoProjectFilesDesktopRow">

      { /* Filename */ }
      <Grid.Column width={ 6 } className="videoProjectFilesDesktopRow__column">
        <div className="videoProjectFilesDesktopRow__column--filename">
          <UploadCompletionTracker fields={ getFields( 1 ) } display={ displayTracker( 1 ) } />
          <UploadCompletionTracker fields={ getFields( 2 ) } display={ displayTracker( 2 ) } />
          <span className="item-text">{ filename }</span>
        </div>
      </Grid.Column>

      { /* Language */ }
      <Grid.Column width={ 4 } style={ show( 1 ) }>
        <LanguageDropdown id={ id } value={ language } onChange={ updateField } required />
      </Grid.Column>

      { /* VideoBurnedInStatus */ }
      <Grid.Column width={ 4 } style={ show( 1 ) }>
        { fileType === 'video'
          ? <VideoBurnedInStatusDropdown id={ id } value={ videoBurnedInStatus } onChange={ updateField } required />
          : renderNotApplicable()
        }
      </Grid.Column>

      { /* Type/Use */ }
      <Grid.Column width={ 4 } style={ show( 2 ) }>
        { ( fileType === 'video' || fileType === 'image' )
          ? <UseDropdown id={ id } value={ use } type={ fileType } onChange={ updateField } />
          : renderNotApplicable()
        }
      </Grid.Column>

      { /* Quality */ }
      <Grid.Column width={ 4 } style={ show( 2 ) }>
        { fileType === 'video'
          ? <QualityDropdown id={ id } type={ fileType } value={ quality } onChange={ updateField } />
          : renderNotApplicable()
        }
      </Grid.Column>

      { /* Actions */ }
      <Grid.Column width={ 2 } only="tablet computer">
        <FileRemoveReplaceButtonGroup
          onReplace={ e => replaceFile( id, e.target.files[0] ) }
          onRemove={ () => removeFile( id ) }
        />
      </Grid.Column>
    </Grid.Row>
  );
};


VideoProjectFilesDesktopRow.propTypes = {
  file: PropTypes.shape( {
    id: PropTypes.string,
    language: PropTypes.string,
    videoBurnedInStatus: PropTypes.string,
    use: PropTypes.string,
    quality: PropTypes.string,
    fileInput: PropTypes.object
  } ),
  activeStep: PropTypes.number,
  show: PropTypes.func
};

export default VideoProjectFilesDesktopRow;
