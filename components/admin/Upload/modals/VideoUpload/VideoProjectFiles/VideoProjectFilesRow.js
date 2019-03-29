import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown';
import VideoBurnedInStatusDropdown from 'components/admin/dropdowns/VideoBurnedInStatusDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown';
import QualityDropdown from 'components/admin/dropdowns/QualityDropdown';
import ActionsMenuFileUpload from 'components/admin/ActionsMenuFileUpload/ActionsMenuFileUpload';
import { truncateAndReplaceStr } from 'lib/utils';
import UploadCompletionTracker from './UploadCompletionTracker';
import './VideoProjectFilesRow.scss';

const VideoProjectFilesRow = props => {
  const {
    showColumn, updateField, replaceAssetFile, removeAssetFile, activeStep, file: {
      id, language, videoBurnedInStatus, use, quality, fileInput: { name, type }
    }
  } = props;

  // extract file type, i.e. get 'image' from the incoming type 'image/*' for exaample
  // item in first index shows the first capturing group in regex
  const fileType = /(\w+)\/(\w+)/.exec( type )[1];
  const filename = ( name.length > 30 ) ? truncateAndReplaceStr( name, 18, 9 ) : name;

  /**
   * Figure out how many dropdowns need to be completed for each step
   * @param {string} ft filetpe of file
   */
  const getNumToComplete = ft => {
    if ( ft === 'video' ) {
      return { step1: 2, step2: 1 };
    } if ( ft === 'image' ) {
      return { step1: 1, step2: 0 };
    }
    return { step1: 1, step2: 0 };
  };

  const numToComplete = getNumToComplete( fileType );

  // Set completion state for num of dropdowns that need to be selected for each step
  const [step1ToComplete, setStep1ToComplete] = useState( numToComplete.step1 );
  const [step2ToComplete, setStep2ToComplete] = useState( numToComplete.step2 );

  /**
   * Toggles trackers display based on activeStep
   * @param {number} step current step
   */
  const displayTracker = step => ( activeStep === step ? 'show' : 'hide' );

  /**
   * Decrease num needed for completion upon dropdown selection.
   * @param {object} e event object
   * @param {object} data data from selected field
   * @param {string} field name of dropdown
   */
  const updateTracker = ( e, data, field ) => {
    if ( field === 'language' || field === 'videoBurnedinStatus' ) {
      setStep1ToComplete( step1ToComplete - 1 );
    } else {
      setStep2ToComplete( step2ToComplete - 1 );
    }

    updateField( e, data, field );
  };

  const renderNotApplicable = () => (
    <div className="videoProjectFilesRow__column--not-applicable">
      Not Applicable
    </div>
  );

  return (
    <Grid.Row>
      { /* Filename */ }
      <Grid.Column mobile={ 16 } tablet={ 6 } computer={ 6 } className="videoProjectFilesRow__column">
        <div className="column-filename">
          <UploadCompletionTracker numToComplete={ step1ToComplete } display={ displayTracker( 1 ) } />
          <UploadCompletionTracker numToComplete={ step2ToComplete } display={ displayTracker( 2 ) } />
          <span className="item-text">{ filename }</span>
        </div>
      </Grid.Column>

      { /* Language */ }
      <Grid.Column mobile={ 16 } tablet={ 4 } computer={ 4 } style={ showColumn( 1 ) } className="file-column">
        <LanguageDropdown id={ id } selected={ language } forFn={ name } onChange={ updateTracker } />
      </Grid.Column>

      { /* VideoBurnedInStatus */ }
      <Grid.Column mobile={ 16 } tablet={ 4 } computer={ 4 } style={ showColumn( 1 ) } className="file-column">
        { fileType === 'video'
          ? <VideoBurnedInStatusDropdown id={ id } selected={ videoBurnedInStatus } forFn={ name } onChange={ updateTracker } />
          : renderNotApplicable()
        }
      </Grid.Column>

      { /* Type/Use */ }
      <Grid.Column mobile={ 16 } tablet={ 4 } computer={ 4 } style={ showColumn( 2 ) } className="file-column">
        { ( fileType === 'video' || fileType === 'image' )
          ? <UseDropdown id={ id } type={ fileType } selected={ use } forFn={ name } onChange={ updateTracker } />
          : renderNotApplicable()
        }
      </Grid.Column>

      { /* Quality */ }
      <Grid.Column mobile={ 16 } tablet={ 4 } computer={ 4 } style={ showColumn( 2 ) } className="file-column">
        { fileType === 'video'
          ? <QualityDropdown id={ id } type={ fileType } selected={ quality } forFn={ name } onChange={ updateTracker } />
          : renderNotApplicable()
        }
      </Grid.Column>

      { /* Actions */ }
      <Grid.Column width={ 2 }>
        <ActionsMenuFileUpload
          id={ id }
          onReplace={ replaceAssetFile }
          onRemove={ removeAssetFile }
        />
      </Grid.Column>
    </Grid.Row>
  );
};


VideoProjectFilesRow.propTypes = {
  file: PropTypes.shape( {
    id: PropTypes.string,
    language: PropTypes.string,
    videoBurnedInStatus: PropTypes.string,
    use: PropTypes.string,
    quality: PropTypes.string,
    fileInput: PropTypes.object
  } ),
  updateField: PropTypes.func,
  replaceAssetFile: PropTypes.func,
  removeAssetFile: PropTypes.func,
  showColumn: PropTypes.func,
  activeStep: PropTypes.number
};

export default VideoProjectFilesRow;
