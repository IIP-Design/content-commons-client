import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import UseDropdown from 'components/admin/dropdowns/UseDropdown/UseDropdown';
import BureauOfficesDropdown from 'components/admin/dropdowns/BureauOfficesDropdown/BureauOfficesDropdown';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import { truncateAndReplaceStr } from 'lib/utils';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import './EditPressOfficeFileRow.scss';

// Optimize re-renders as component could potentially have many rows
const areEqual = ( prevProps, nextProps ) => {
  const nextFile = nextProps.file;

  //  check for prop differences
  const entries = Object.entries( prevProps.file );
  const same = entries.every( ( [prop, value] ) => {
    if ( prop === 'id' ) {
      return true;
    }
    return nextFile[prop] === value;
  } );
  return same;
};

const EditPressOfficeFileRow = props => {
  const {
    file: {
      id, name, use, bureaus
    },
    update,
    removeFile,
    accept
  } = props;

  // extract file type, i.e. get 'image' from the incoming type 'image/*' for example
  // item in first index shows the first capturing group in regex
  // let fileType = /(\w+)\/(\w+)/.exec( type );
  // fileType = ( fileType ) ? fileType[1] : '';
  const filename = name && name.length > 44 ? truncateAndReplaceStr( name, 44, 8 ) : name;

  return (
    <Grid.Row>
      { /* Filename */ }
      <Grid.Column width={ 6 } className="column">
        <div className="filename">
          { filename !== name ? (
            <Fragment>
              <span tooltip={ name }>{ filename }</span>
              <VisuallyHidden el="span">{ name }</VisuallyHidden>
            </Fragment>
          ) : (
            <span>{ name }</span>
          ) }
        </div>
      </Grid.Column>

      { /* Release Type (document use) */ }
      <Grid.Column width={ 4 } style={ { paddingRight: 0 } }>
        <UseDropdown id={ id } type="document" value={ use } onChange={ update } required />
      </Grid.Column>

      { /* Bureaus */ }
      <Grid.Column width={ 5 } style={ { paddingRight: 0 } }>
        <BureauOfficesDropdown id={ id } value={ bureaus } multiple search onChange={ update } required />
      </Grid.Column>

      { /* Actions */ }
      <Grid.Column width={ 1 }>
        <FileRemoveReplaceButtonGroup
          onRemove={ () => {
            removeFile( id, name );
          } }
          accept={ accept }
        />
      </Grid.Column>
    </Grid.Row>
  );
};


EditPressOfficeFileRow.propTypes = {
  file: PropTypes.shape( {
    id: PropTypes.string,
    name: PropTypes.string,
    use: PropTypes.string,
    bureaus: PropTypes.array
  } ),
  accept: PropTypes.string,
  update: PropTypes.func,
  removeFile: PropTypes.func
};


export default React.memo( EditPressOfficeFileRow, areEqual );
