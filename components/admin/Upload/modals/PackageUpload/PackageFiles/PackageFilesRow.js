import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid } from 'semantic-ui-react';
import { truncateAndReplaceStr } from 'lib/utils';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import ReleaseTypeDropdown from 'components/admin/dropdowns/ReleaseTypeDropdown/ReleaseTypeDropdown';
import UploadCompletionTracker from '../../VideoUpload/VideoProjectFiles/UploadCompletionTracker';


import tmpReleaseTypes from './tempReleaseTypes';


const PackageFilesRow = props => {
  const {
    updateField,
    removePackageFile,
    file: {
      id,
      input: { name },
      use,
      text
    }
  } = props;
  const filename = ( name.length > 25 ) ? truncateAndReplaceStr( name, 15, 8 ) : name;

  return (
    <Grid.Row key={ id } className="packageFiles_file">
      <Grid.Column width={ 6 }>
        <div className="packageFiles_file_filename">
          <UploadCompletionTracker fields={ [use] } display="show" />
          <span className="item-text" aria-hidden>
            { filename }
            <span className="item-text--hover">{ name }</span>
          </span>
          <VisuallyHidden el="span">{ name }</VisuallyHidden>
        </div>
      </Grid.Column>
      <Grid.Column width={ 6 }><Form.Input value={ text } /></Grid.Column>
      <Grid.Column width={ 4 }>
        <ReleaseTypeDropdown id={ id } value={ use } releaseTypes={ tmpReleaseTypes } onChange={ updateField } />
        { /* <FileRemoveReplaceButtonGroup onRemove={ () => { removePackageFile( id ) } } /> */ }
      </Grid.Column>
    </Grid.Row>
  );
};

PackageFilesRow.propTypes = {
  file: PropTypes.object,
  updateField: PropTypes.func,
  removePackageFile: PropTypes.func,
};

export default PackageFilesRow;
