import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import {
  Form, Grid, Input, Loader
} from 'semantic-ui-react';
import { getCount } from 'lib/utils';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import CountriesRegionsDropdown from 'components/admin/dropdowns/CountriesRegionsDropdown/CountriesRegionsDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown/UseDropdown';
import VisibilityDropdown from 'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown';
import BureauOfficesDropdown from 'components/admin/dropdowns/BureauOfficesDropdown/BureauOfficesDropdown';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { HandleOnChangeContext } from 'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsForm/PackageDetailsForm';
import './PressPackageFile.scss';


// todo: write props comparison
// use memo here to avoid rerending this files
// when it is not re-rendered
// const areEqual = ( prevProps, nextProps ) => {
//   return prevProps.value === nextProps.value;
// };

const PressPackageFile = props => {
  const { document } = props;
  const handleOnChange = useContext( HandleOnChangeContext );
  const { errors, touched, values } = useFormikContext();

  if ( !document || !getCount( document ) ) return null;

  const { id, filename, image } = document;

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

  const isTouched = field => (
    touched && touched[id] && touched[id][field]
  );

  const hasError = field => (
    errors && errors[id] && !!errors[id][field]
  );

  const showErrorMsg = field => (
    isTouched( field ) ? errors && errors[id] && errors[id][field] : ''
  );

  const value = values[id] ? values[id] : '';

  return (
    <div id={ id } className="package-file">
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={ 16 } tablet={ 4 } computer={ 4 }>
            { getCount( image ) && image[0].signedUrl ? (
              <img src={ image[0].signedUrl } alt={ image[0].alt } />
            ) : (
              <div className="placeholder outer">
                <div className="placeholder inner" />
                <Loader active size="small" />
              </div>
            ) }
          </Grid.Column>

          <Grid.Column mobile={ 16 } tablet={ 12 } computer={ 12 }>
            <fieldset className="form-fields" name={ filename }>
              <VisuallyHidden el="legend">
                { `edit fields for ${filename}` }
              </VisuallyHidden>
              <Form.Group widths="equal">
                <div className="field">
                  <Form.Field
                    id={ `title-${id}` }
                    name={ `${id}.title` }
                    control={ Input }
                    label="Title"
                    required
                    autoFocus
                    value={ value.title || '' }
                    onChange={ handleOnChange }
                    error={ isTouched( 'title' ) && hasError( 'title' ) }
                  />
                  <p className="error-message">{ showErrorMsg( 'title' ) }</p>
                </div>

                <Form.Field>
                  <BureauOfficesDropdown
                    id={ `bureaus-${id}` }
                    name={ `${id}.bureaus` }
                    label="Lead Bureau(s)"
                    value={ value.bureaus || [] }
                    onChange={ handleOnChange }
                    error={ isTouched( 'bureaus' ) && hasError( 'bureaus' ) }
                    multiple
                    search
                    required
                  />
                  <p className="field__helper-text">Begin typing bureau name and separate by commas.</p>
                  <p className="error-message">{ showErrorMsg( 'bureaus' ) }</p>
                </Form.Field>
              </Form.Group>

              <Form.Group widths="equal">
                <Form.Field>
                  <UseDropdown
                    id={ `use-${id}` }
                    name={ `${id}.use` }
                    label="Release Type"
                    onChange={ handleOnChange }
                    type="document"
                    value={ value.use || '' }
                    error={ isTouched( 'use' ) && !value.use }
                    required
                  />
                  <p className="error-message">{ showErrorMsg( 'use' ) }</p>
                </Form.Field>

                <Form.Field>
                  <VisibilityDropdown
                    id={ `visibility-${id}` }
                    name={ `${id}.visibility` }
                    label="Visibility Setting"
                    value={ value.visibility || '' }
                    onChange={ handleOnChange }
                    error={ isTouched( 'visibility' ) && hasError( 'visibility' ) }
                    required
                  />
                  <p className="error-message">{ showErrorMsg( 'visibility' ) }</p>
                </Form.Field>
              </Form.Group>

              <Form.Group widths="equal">
                <Form.Field>
                  <div className="data">
                    <MetaTerms unitId={ id } terms={ metaData } />
                  </div>
                </Form.Field>

                <Form.Field>
                  <CountriesRegionsDropdown
                    id={ `countries-${id}` }
                    name={ `${id}.countries` }
                    label="Countries/Regions Tags"
                    value={ value.countries || [] }
                    onChange={ handleOnChange }
                    error={ isTouched( 'countries' ) && hasError( 'countries' ) }
                    multiple
                    search
                  />
                  <p className="field__helper-text">Enter keywords separated by commas.</p>
                </Form.Field>
              </Form.Group>
            </fieldset>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

PressPackageFile.propTypes = {
  document: PropTypes.shape( {
    id: PropTypes.string,
    filename: PropTypes.string,
    image: PropTypes.array
  } )
};

// export default React.memo( PressPackageFile, areEqual );
export default PressPackageFile;
