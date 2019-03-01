import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Select } from 'semantic-ui-react';
import replaceIcon from '../../../../../../static/icons/icon_replace.svg';
import removeIcon from '../../../../../../static/icons/icon_remove.svg';
import { truncateAndReplaceStr } from '../../../../../../lib/utils';

const options = [
  { key: 'test1', value: 'test1', text: 'STEP TWO Test 1' },
  { key: 'test2', value: 'test2', text: 'STEP TWO Test 2' },
  { key: 'test3', value: 'test3', text: 'STEP TWO Test 3' }
];

const FilesStepTwo = ( { file } ) => {
  const { name } = file;
  let fileDisplayName;

  if ( name.length > 30 ) {
    fileDisplayName = truncateAndReplaceStr( name, 18, 9 );
  } else {
    fileDisplayName = name;
  }

  return (
    <Grid.Row className="videoProjectFiles_asset">
      <Grid.Column width={ 6 }>
        <p className="videoProjectFiles_asset_file">{ fileDisplayName }</p>
      </Grid.Column>
      <Grid.Column width={ 10 }>
        <Select
          options={ options }
          className="videoProjectFiles_asset_language"
          placeholder="-"
        />
        <Select
          options={ options }
          className="videoProjectFiles_asset_subtitles"
          placeholder="-"
        />
        <div className="videoProjectFiles_asset_actionBtns">
          <img
            src={ replaceIcon }
            alt="Replace Video File Button"
            className="videoProjectFiles_asset_replaceBtn"
          />
          <img
            src={ removeIcon }
            alt="Remove Video File Button"
            className="videoProjectFiles_asset_removeBtn"
          />
        </div>
      </Grid.Column>
    </Grid.Row>
  );
};

FilesStepTwo.propTypes = {
  file: PropTypes.object
};

export default FilesStepTwo;
