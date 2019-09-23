import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { truncateAndReplaceStr } from 'lib/utils';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown';
import VideoBurnedInStatusDropdown from 'components/admin/dropdowns/VideoBurnedInStatusDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown';
import QualityDropdown from 'components/admin/dropdowns/QualityDropdown';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import UploadCompletionTracker from 'components/admin/Upload/modals/VideoUpload/VideoProjectFiles/UploadCompletionTracker';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import './EditProjectUnitsRow.scss';

const EditProjectUnitsRow = props => {
  const {
    videoFile: {
      id, name, language, videoBurnedInStatus, use, quality
    },
    update,
    removeFile,
    replaceFile,
    activeStep,
    show
  } = props;
  const filename = ( name && name.length > 25 ) ? truncateAndReplaceStr( name, 15, 8 ) : name;

  /**
   * Toggles trackers display based on activeStep
   * Not using show() as need to use !important in css rule
   * @param {number} step current step
   */
  const displayTracker = step => ( activeStep === step ? 'show' : 'hide' );

  /**
   * Figure out how many dropdowns need to be tracked for completion for each step
   * @param {number} step active step
   */
  const getFields = step => {
    if ( step === 1 ) {
      return [language, videoBurnedInStatus];
    }
    return [use, quality];
  };

  return (
    <Grid.Row className="videoProjectFilesDesktopRow">
      { /* Filename */ }
      <Grid.Column width={ 6 } className="videoProjectFilesDesktopRow__column">
        <div className="videoProjectFilesDesktopRow__column--filename">
          <UploadCompletionTracker fields={ getFields( 1 ) } display={ displayTracker( 1 ) } />
          <UploadCompletionTracker fields={ getFields( 2 ) } display={ displayTracker( 2 ) } />
          <span className="item-text" aria-hidden>
            { filename }
            <span className="item-text--hover">{ name }</span>
          </span>
          <VisuallyHidden el="span">{ name }</VisuallyHidden>
        </div>
      </Grid.Column>

      { /* Language */ }
      <Grid.Column width={ 4 } style={ show( 1 ) }>
        <LanguageDropdown id={ id } value={ language } onChange={ update } required />
      </Grid.Column>

      <Grid.Column width={ 4 } style={ show( 1 ) }>
        <VideoBurnedInStatusDropdown id={ id } value={ videoBurnedInStatus } onChange={ update } required />
      </Grid.Column>

      <Grid.Column width={ 4 } style={ show( 2 ) }>
        <UseDropdown id={ id } value={ use } type="video" onChange={ update } />
      </Grid.Column>

      <Grid.Column width={ 4 } style={ show( 2 ) }>
        <QualityDropdown id={ id } value={ quality } type="video" onChange={ update } />
      </Grid.Column>

      { /* Actions */ }
      <Grid.Column width={ 2 } only="tablet computer" style={ { paddingLeft: 0 } }>
        <FileRemoveReplaceButtonGroup
          onReplace={ e => { replaceFile( id, e.target.files[0] ); } }
          onRemove={ () => { removeFile( id, name ); } }
          accept=".mov, .mp4, .mpg, .wmv, .avi"
        />
      </Grid.Column>
    </Grid.Row>
  );
};

EditProjectUnitsRow.propTypes = {
  videoFile: PropTypes.object,
  update: PropTypes.func,
  removeFile: PropTypes.func,
  replaceFile: PropTypes.func,
  activeStep: PropTypes.number,
  show: PropTypes.func
};

export default EditProjectUnitsRow;
