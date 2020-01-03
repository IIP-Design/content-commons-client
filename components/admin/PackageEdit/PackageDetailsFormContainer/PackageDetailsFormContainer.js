/**
 *
 * PackageDetailsFormContainer
 *
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import useTimeout from 'lib/hooks/useTimeout';
import { buildUpdatePackageTree } from 'lib/graphql/builders/package';
import { UPDATE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';
import Notification from 'components/Notification/Notification';
import PackageDetailsForm from './PackageDetailsForm/PackageDetailsForm';
import { initialSchema, baseSchema } from './validationSchema';

const PackageDetailsFormContainer = props => {
  const { pkg } = props;
  const [updatePackage] = useMutation( UPDATE_PACKAGE_MUTATION );
  const [showNotification, setShowNotification] = useState( false );
  const hideNotification = () => setShowNotification( false );
  const { startTimeout } = useTimeout( hideNotification, 2000 );

  if ( !pkg ) return null;

  const update = async ( values, prevValues ) => {
    const { id } = pkg;

    if ( id ) { // ensure we have a package
      await updatePackage( {
        variables: {
          data: buildUpdatePackageTree( values, prevValues ),
          where: { id }
        },
      } ).catch( err => console.dir( err ) );
    }
  };

  const save = async ( values, prevValues ) => {
    await update( values, prevValues );
    setShowNotification( true );
    props.setIsDirty( true );
    startTimeout();
  };

  const getDropdownIds = property => ( ( property && Array.isArray( property ) ) ? property.map( p => p.id ) : [] );

  const getFiles = _pkg => {
    if ( _pkg ) {
      return _pkg.documents || [];
    }
    return [];
  };

  const getFileValues = array => (
    array.reduce( ( acc, file ) => {
      const {
        id, bureaus, filename, tags, title, use, visibility
      } = file;
      return {
        ...acc,
        [id]: {
          id,
          title: title || filename,
          bureaus: getDropdownIds( bureaus ),
          tags: getDropdownIds( tags ),
          use: use.id,
          visibility
        }
      };
    }, {} )
  );

  const getInitialValues = () => {
    let initialValues = {};

    if ( pkg ) {
      const files = getFiles( pkg );

      initialValues = {
        title: pkg.title || '',
        type: pkg.type || '',
        termsConditions: false,
        ...getFileValues( files )
      };
    }

    return initialValues;
  };

  const renderContent = formikProps => (
    <div className="edit-package__form">
      <Notification
        el="p"
        customStyles={ {
          position: 'absolute',
          top: '9em',
          left: '50%',
          transform: 'translateX(-50%)'
        } }
        show={ showNotification }
        msg="Changes saved"
      />
      <PackageDetailsForm
        { ...formikProps }
        { ...props }
        save={ save }
      >
        { props.children }
      </PackageDetailsForm>
    </div>
  );

  return (
    <Formik
      initialValues={ getInitialValues() }
      enableReinitialize // allow form to re initialize on document upload
      validationSchema={ props.id ? baseSchema : initialSchema }
    >
      { renderContent }
    </Formik>
  );
};

PackageDetailsFormContainer.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node, // eslint-disable-line
  setIsDirty: PropTypes.func,
  pkg: PropTypes.shape( {
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    documents: PropTypes.array
  } )
};

export default PackageDetailsFormContainer;
