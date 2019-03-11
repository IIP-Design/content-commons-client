import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Select } from 'semantic-ui-react';
import replaceIcon from '../../../../../../static/icons/icon_replace.svg';
import removeIcon from '../../../../../../static/icons/icon_remove.svg';
import '../../../../../../styles/tooltip.scss';
import { truncateAndReplaceStr } from '../../../../../../lib/utils';

const stepOneOptions = [
  { key: 'test1', value: 'test1', text: 'STEP 1 Test 1' },
  { key: 'test2', value: 'test2', text: 'STEP 1 Test 2' },
  { key: 'test3', value: 'test3', text: 'STEP 1 Test 3' }
];

const stepTwoOptions = [
  { key: 'test1', value: 'test1', text: 'STEP 2 Test 1' },
  { key: 'test2', value: 'test2', text: 'STEP 2 Test 2' },
  { key: 'test3', value: 'test3', text: 'STEP 2 Test 3' }
];

class VideoAssetFile extends PureComponent {
  render() {
    const {
      activeStep,
      file,
      removeVideoAssetFile,
      replaceVideoAssetFile
    } = this.props;

    const name = file;
    let fileDisplayName;

    if ( name.length > 30 ) {
      fileDisplayName = truncateAndReplaceStr( name, 18, 9 );
    } else {
      fileDisplayName = name;
    }

    return (
      <Grid.Row className="videoProjectFiles_asset">
        <Grid.Column width={ 6 }>
          <p className="videoProjectFiles_asset_file" title={ name }>{ fileDisplayName }</p>
        </Grid.Column>
        <Grid.Column width={ 10 }>
          <Select
            options={ activeStep === 'step_1' ? stepOneOptions : stepTwoOptions }
            className={
              activeStep === 'step_1'
                ? 'videoProjectFiles_asset_language'
                : 'videoProjectFiles_asset_typeUse'
            }
            placeholder="-"
          />
          <Select
            options={ activeStep === 'step_1' ? stepOneOptions : stepTwoOptions }
            className={
              activeStep === 'step_1'
                ? 'videoProjectFiles_asset_subtitles'
                : 'videoProjectFiles_asset_quality'
            }
            placeholder="-"
          />
          <div className="videoProjectFiles_asset_actionBtns">
            <span tooltip="Replace">
              <label htmlFor="replace_videoAssetFile" className="videoProjectFiles_asset_replaceBtn">
                <input
                  type="file"
                  name="replace_videoAssetFile"
                  data-filename={ name }
                  ref={ ref => { this.replaceFile = ref; } }
                  onChange={ replaceVideoAssetFile }
                />
                <button type="button" onClick={ () => this.replaceFile.click() }>
                  <img
                    src={ replaceIcon }
                    alt="Replace Video File Button"
                  />
                </button>
              </label>
            </span>
            <span tooltip="Remove">
              <button type="button" onClick={ () => removeVideoAssetFile( name ) }>
                <img
                  src={ removeIcon }
                  alt="Remove Video File Button"
                  className="videoProjectFiles_asset_removeBtn"
                />
              </button>
            </span>
          </div>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

VideoAssetFile.propTypes = {
  file: PropTypes.string,
  activeStep: PropTypes.string,
  removeVideoAssetFile: PropTypes.func,
  replaceVideoAssetFile: PropTypes.func
};

export default VideoAssetFile;
