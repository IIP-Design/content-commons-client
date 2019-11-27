import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import { Form, Grid, Input } from 'semantic-ui-react';
// remove sortBy after GraphQL is implemented
import sortBy from 'lodash/sortBy';
import { getCount } from 'lib/utils';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import TagDropdown from 'components/admin/dropdowns/TagDropdown/TagDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown/UseDropdown';
import VisibilityDropdown from 'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown';
// import test data for UI dev; remove after GraphQL is implemented
import { bureaus } from 'components/admin/dropdowns/BureauOfficesDropdown/mocks';
import { HandleOnChangeContext } from 'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsForm/PackageDetailsForm';
import './PressPackageFile.scss';

const PressPackageFile = props => {
  const handleOnChange = useContext( HandleOnChangeContext );

  const { id, filename, image } = props.unit;
  const {
    handleChange, errors, touched, values
  } = props.formik;

  const metaData = [
    {
      name: 'file-name',
      displayName: 'File Name',
      definition: filename || ''
    },
    {
      name: 'pages',
      displayName: 'Pages',
      definition: 'TBD'
    }
  ];

  // for UI dev; remove after GraphQL is implemented
  let options = [];
  if ( bureaus ) {
    options = sortBy( bureaus, bureau => bureau.name )
      .map( bureau => ( { key: bureau.id, text: bureau.name, value: bureau.id } ) );
  }

  return (
    <div id={ id } className="package-file">
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={ 16 } tablet={ 4 } computer={ 4 } className="thumbnail">
            { getCount( image ) && image[0].signedUrl
              ? <img src={ image[0].signedUrl } alt={ image[0].alt } />
              : <div className="placeholder" /> }
          </Grid.Column>

          <Grid.Column mobile={ 16 } tablet={ 12 } computer={ 12 }>
            <div className="form-fields">
              <Form.Group widths="equal">
                <div className="field">
                  <Form.Field
                    id={ `fileTitle-${id}` }
                    name={ `files.${id}.fileTitle` }
                    control={ Input }
                    label="Title"
                    required
                    autoFocus
                    value={ values.files[id].fileTitle }
                    onChange={ handleChange }
                    error={ touched && touched.title && !!errors.title }
                  />
                  <p className="error-message">{ touched.title ? errors.title : '' }</p>
                </div>

                <Form.Field>
                  { /**
                     * for UI dev;
                     * replace with <BureauOfficesDropdown />
                     * after GraphQL is implemented
                     */ }
                  <Form.Dropdown
                    id={ `bureaus-${id}` }
                    name={ `files.${id}.bureaus` }
                    label="Lead Bureau(s)"
                    options={ options }
                    placeholder="–"
                    onChange={ handleOnChange }
                    value={ values.files[id].bureaus }
                    error={ touched.bureaus && !!errors.bureaus }
                    multiple
                    search
                    fluid
                    selection
                    required
                  />
                  <p className="field__helper-text">Enter keywords separated by commas.</p>
                </Form.Field>
              </Form.Group>

              <Form.Group widths="equal">
                <Form.Field>
                  <UseDropdown
                    id={ `use-${id}` }
                    name={ `files.${id}.use` }
                    label="Release Type"
                    onChange={ handleOnChange }
                    type="document"
                    value={ values.files[id].use }
                    required
                  />
                </Form.Field>

                <Form.Field>
                  <VisibilityDropdown
                    id={ `visibility-${id}` }
                    name={ `files.${id}.visibility` }
                    label="Visibility Setting"
                    value={ values.files[id].visibility }
                    onChange={ handleOnChange }
                    error={ touched.visibility && !!errors.visibility }
                  />
                </Form.Field>
              </Form.Group>

              <Form.Group widths="equal">
                <Form.Field>
                  <div className="data">
                    <MetaTerms unitId={ id } terms={ metaData } />
                  </div>
                </Form.Field>

                <Form.Field>
                  <TagDropdown
                    id={ `tags-${id}` }
                    name={ `files.${id}.tags` }
                    label="Tags"
                    value={ values.files[id].tags }
                    error={ touched.tags && !!errors.tags }
                    onChange={ handleOnChange }
                  />
                  <p className="field__helper-text">Enter keywords separated by commas.</p>
                </Form.Field>
              </Form.Group>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

PressPackageFile.propTypes = {
  formik: PropTypes.object,
  unit: PropTypes.object
};

export default connect( PressPackageFile );
