/**
 *
 * PackageDetailsFormContainer
 *
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'next/router';
// import { compose, graphql } from 'react-apollo';
import { Formik } from 'formik';
import useTimeout from 'lib/hooks/useTimeout';
import { getFileNameNoExt } from 'lib/utils';
import Notification from 'components/Notification/Notification';
import PackageDetailsForm from './PackageDetailsForm/PackageDetailsForm';
import { initialSchema, baseSchema } from './validationSchema';

const PackageDetailsFormContainer = props => {
  const { children } = props;

  const [showNotification, setShowNotification] = useState( false );

  const hideNotification = () => {
    setShowNotification( false );
  };

  const { startTimeout } = useTimeout( hideNotification, 2000 );

  const update = async ( values, prevValues ) => {
    const { id, updatePackage } = props;
    if ( id ) { // ensure we have a package
      await updatePackage( {
        variables: {
          data: {},
          where: { id }
        },
      } ).catch( err => console.dir( err ) );
    }
  };

  const save = async ( values, prevValues ) => {
    await update( values, prevValues );
    setShowNotification( true );

    // Notify redux state that Package updated, indexed by package id
    const { id, packageUpdated } = props;
    packageUpdated( id, true );

    startTimeout();
  };

  const getDropdownIds = property => (
    property.map( p => p.id )
  );

  const getFileValues = array => (
    array.reduce( ( acc, doc ) => {
      const {
        id, bureaus, filename, tags, use, visibility
      } = doc;
      return {
        ...acc,
        [id]: {
          title: getFileNameNoExt( filename ) || filename,
          bureaus: getDropdownIds( bureaus ),
          tags: getDropdownIds( tags ),
          use: use.id,
          visibility
        }
      };
    }, {} )
  );

  const getInitialValues = () => {
    const { data } = props;
    const pkg = ( data && data.package ) ? data.package : {};
    const files = pkg.documents || [];

    const initialValues = {
      title: pkg.title || '',
      type: pkg.type || '',
      termsConditions: false,
      files: getFileValues( files )
    };

    return initialValues;
  };

  const onHandleSubmit = ( values, actions ) => {
    console.log( values, actions );
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
        { children }
      </PackageDetailsForm>
    </div>
  );

  return (
    <Formik
      initialValues={ getInitialValues() }
      validationSchema={ props.id ? baseSchema : initialSchema }
      onSubmit={ onHandleSubmit }
    >
      { renderContent }
    </Formik>
  );
};

PackageDetailsFormContainer.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  children: PropTypes.node,
  // createPackage: PropTypes.func,
  // updateNotification: PropTypes.func,
  // handleUpload: PropTypes.func,
  updatePackage: PropTypes.func,
  packageUpdated: PropTypes.func
};

export default PackageDetailsFormContainer;

// export default compose(
//   withRouter,
//   connect( null, reduxActions ),
//   graphql( CREATE_PACKAGE_MUTATION, { name: 'createPackage' } ),
//   graphql( UPDATE_PACKAGE_MUTATION, { name: 'updatePackage' } ),
//   graphql( PACKAGE_QUERY, {
//     partialRefetch: true,
//     options: props => ( {
//       variables: { id: props.id }
//     } ),
//     skip: props => !props.id
//   } )
// )( PackageDetailsFormContainer );
