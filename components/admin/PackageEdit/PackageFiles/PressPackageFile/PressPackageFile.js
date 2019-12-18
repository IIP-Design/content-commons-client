import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { useFormikContext } from 'formik';
import {
  Form, Grid, Input, Loader
} from 'semantic-ui-react';
// remove sortBy after GraphQL is implemented
import sortBy from 'lodash/sortBy';
import { getCount } from 'lib/utils';
import { DOCUMENT_FILE_QUERY } from 'lib/graphql/queries/document';
import ApolloError from 'components/errors/ApolloError';
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
  const { errors, touched, values } = useFormikContext();

  const { loading, error, data } = useQuery( DOCUMENT_FILE_QUERY, {
    partialRefetch: true,
    variables: { id: props.id },
    skip: !props.id,
    notifyOnNetworkStatusChange: true
  } );

  if ( loading ) {
    return (
      <div style={ {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      } }
      >
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
          content="Loading package file..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;

  if ( !data ) return null;
  const { id, filename, image } = data.documentFile;

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
              : (
                <div className="placeholder outer">
                  <div className="placeholder inner" />
                  <Loader active size="small" />
                </div>
              ) }
          </Grid.Column>

          <Grid.Column mobile={ 16 } tablet={ 12 } computer={ 12 }>
            <div className="form-fields">
              <Form.Group widths="equal">
                <div className="field">
                  <Form.Field
                    id={ `title-${id}` }
                    name={ `${id}.title` }
                    control={ Input }
                    label="Title"
                    required
                    autoFocus
                    value={ values[id].title }
                    onChange={ handleOnChange }
                    error={ isTouched( 'title' ) && hasError( 'title' ) }
                  />
                  <p className="error-message">{ showErrorMsg( 'title' ) }</p>
                </div>

                <Form.Field>
                  { /**
                     * for UI dev;
                     * replace with <BureauOfficesDropdown />
                     * after GraphQL is implemented
                     */ }
                  <Form.Dropdown
                    id={ `bureaus-${id}` }
                    name={ `${id}.bureaus` }
                    label="Lead Bureau(s)"
                    options={ options }
                    placeholder="–"
                    onChange={ handleOnChange }
                    value={ values[id].bureaus }
                    error={ isTouched( 'bureaus' ) && hasError( 'bureaus' ) }
                    multiple
                    search
                    fluid
                    selection
                    required
                  />
                  <p className="field__helper-text">Enter keywords separated by commas.</p>
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
                    value={ values[id].use }
                    error={ isTouched( 'use' ) && errors && errors[id] && !errors[id].use }
                    required
                  />
                  <p className="error-message">{ showErrorMsg( 'use' ) }</p>
                </Form.Field>

                <Form.Field>
                  <VisibilityDropdown
                    id={ `visibility-${id}` }
                    name={ `${id}.visibility` }
                    label="Visibility Setting"
                    value={ values[id].visibility }
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
                  <TagDropdown
                    id={ `tags-${id}` }
                    name={ `${id}.tags` }
                    label="Tags"
                    value={ values[id].tags }
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
  id: PropTypes.string
};

export default PressPackageFile;
