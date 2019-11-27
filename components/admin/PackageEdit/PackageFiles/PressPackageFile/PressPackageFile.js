import React from 'react';
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
import './PressPackageFile.scss';

const PressPackageFile = props => {
  const {
    id, filename, image, use
  } = props.unit;
  const { errors, touched, values } = props.formik;
  const unitValues = values.files.find( val => val.id === id );

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
                    id={ `title-${id}` }
                    name={ `title-${id}` }
                    control={ Input }
                    label="Title"
                    required
                    autoFocus
                    value={ unitValues.title }
                    onChange={ () => {} }
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
                    name={ `bureaus-${id}` }
                    label="Lead Bureau(s)"
                    options={ options }
                    placeholder="–"
                    value={ unitValues.bureaus }
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
                    name={ `use-${id}` }
                    label="Release Type"
                    onChange={ () => {} }
                    type="document"
                    value={ use.id }
                    required
                  />
                </Form.Field>

                <Form.Field>
                  <VisibilityDropdown
                    id={ `visibility-${id}` }
                    name={ `visibility-${id}` }
                    label="Visibility Setting"
                    value={ unitValues.visibility }
                    onChange={ () => {} }
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
                    name={ `tags-${id}` }
                    label="Tags"
                    value={ unitValues.tags }
                    error={ touched.tags && !!errors.tags }
                    onChange={ () => {} }
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
