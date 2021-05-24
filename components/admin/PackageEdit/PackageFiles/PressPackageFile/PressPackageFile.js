import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { getCount } from 'lib/utils';
import thumbnailUnavailable from 'static/images/thumbnail_document_unavailable.png';
import thumbnail from 'static/images/thumbnail_document.png';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import DocumentPlaceholder from 'components/Placeholder/DocumentPlaceholder';
import CountriesRegionsDropdown from 'components/admin/dropdowns/CountriesRegionsDropdown/CountriesRegionsDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown/UseDropdown';
import VisibilityDropdown from 'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown';
import BureauOfficesDropdown from 'components/admin/dropdowns/BureauOfficesDropdown/BureauOfficesDropdown';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import TextInput from 'components/admin/PackageCreate/PackageForm/TextInput/TextInput';
import { HandleOnChangeContext } from 'components/admin/PackageCreate/PackageForm/PackageForm';
import styles from './PressPackageFile.module.scss';

// todo: write props comparison
// use memo here to avoid re-rending this files
// when it is not re-rendered
// const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const PressPackageFile = props => {
  const { document } = props;
  const handleOnChange = useContext( HandleOnChangeContext );
  const { errors, touched, values } = useFormikContext();

  if ( !document || !getCount( document ) ) return null;

  const {
    id, filename, image, language,
  } = document;

  const metaData = [
    {
      name: 'file-name',
      displayName: 'File Name',
      definition: filename || '',
    },
    {
      name: 'pages',
      displayName: 'Pages',
      definition: 'TBD',
    },
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

  const getThumbnail = () => {
    if ( getCount( image ) ) {
      if ( image[0].url === 'UNAVAILABLE' ) {
        return <img src={ thumbnailUnavailable } alt="Thumbnail unavailable" />;
      }
      if ( image[0].url === 'NONE' ) {
        return <img src={ thumbnail } alt="Thumbnail" />;
      }
      if ( image[0].signedUrl ) {
        return <img src={ image[0].signedUrl } alt={ image[0].alt } />;
      }
    }

    return <DocumentPlaceholder />;
  };

  return (
    <div id={ id } className={ styles.package_file }>
      <div className={ styles.thumbnail }>
        { ' ' }
        { getThumbnail( image ) }
      </div>
      <fieldset className={ styles.fieldset } name={ filename }>
        <VisuallyHidden el="legend">{ `edit fields for ${filename}` }</VisuallyHidden>
        <div>
          <TextInput
            label="Title"
            id={ `title-${id}` }
            name={ `${id}.title` }
            type="text"
            value={ value.title || '' }
            required
          />
        </div>
        <div className={ styles.dropdown_required }>
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
          <p className={ styles['field__helper-text'] }>
            Begin typing bureau name and separate by commas.
          </p>
          <p className="error-message">{ showErrorMsg( 'bureaus' ) }</p>
        </div>
        <div className={ styles.dropdown_required }>
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
        </div>
        <div className={ styles.dropdown_required }>
          <VisibilityDropdown
            id={ `visibility-${id}` }
            name={ `${id}.visibility` }
            label="Visibility Setting"
            value={ value.visibility || '' }
            onChange={ handleOnChange }
            error={ isTouched( 'visibility' ) && hasError( 'visibility' ) }
            required
            hide="public"
          />
          <p className="error-message">{ showErrorMsg( 'visibility' ) }</p>
        </div>
        <div className="data" lang={ language.languageCode }>
          <MetaTerms unitId={ id } terms={ metaData } />
        </div>
        <div>
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
          <p className={ styles['field__helper-text'] }>Enter keywords separated by commas.</p>
        </div>

      </fieldset>
    </div>
  );
};

PressPackageFile.propTypes = {
  document: PropTypes.shape( {
    id: PropTypes.string,
    filename: PropTypes.string,
    image: PropTypes.array,
    language: PropTypes.object,
  } ),
};

// export default React.memo( PressPackageFile, areEqual );
export default PressPackageFile;
