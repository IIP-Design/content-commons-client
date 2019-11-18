/**
 *
 * PressPackageDetailsForm
 *
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'next/router';
// import { compose, graphql } from 'react-apollo';
import { Formik } from 'formik';

import PackageDetailsForm from 'components/admin/PackageEdit/PackageDetailsForm/PackageDetailsForm';
import Notification from 'components/Notification/Notification';

import useTimeout from 'lib/hooks/useTimeout';
import { initialSchema, baseSchema } from './validationSchema';

const PressPackageDetailsForm = props => {
  const { children } = props;

  const [showNotication, setShowNotification] = useState( false );

  const hideNotification = () => {
    setShowNotification( false );
  };

  const { startTimeout } = useTimeout( hideNotification, 2000 );

  const update = async ( values, prevValues ) => {
    const { id, updatePressPackage } = props;
    if ( id ) { // ensure we have a package
      await updatePressPackage( {
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

  const getInitialValues = () => {
    const { data } = props;
    const pressPackage = ( data && data.package ) ? data.package : {};
    const documents = pressPackage.documents || [];

    const initialValues = {
      title: pressPackage.title || '',
      type: pressPackage.type || 'DAILY_GUIDANCE',
      documents: documents.map( doc => {
        const {
          id, bureaus, categories, tags, visibility
        } = doc;

        return {
          id,
          bureaus: getDropdownIds( bureaus ),
          categories: getDropdownIds( categories ),
          tags: getDropdownIds( tags ),
          visibility
        };
      } )
    };

    return initialValues;
  };

  const onHandleSubmit = ( values, actions ) => {
    console.log( values, actions );
  };

  const renderContent = formikProps => {
    const contentStyle = {
      border: `3px solid ${( props.id ) ? 'transparent' : '#02bfe7'}`
    };

    return (
      <div className="edit-package__form" style={ contentStyle }>
        <Notification
          el="p"
          customStyles={ {
            position: 'absolute',
            top: '9em',
            left: '50%',
            transform: 'translateX(-50%)'
          } }
          show={ showNotication }
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
  };

  return (
    <Formik
      initialValues={ getInitialValues() }
      validationSchema={ props.id ? baseSchema : initialSchema }
      onSubmit={ onHandleSubmit }
      render={ renderContent }
    />
  );
};

PressPackageDetailsForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  children: PropTypes.node,
  // createPressPackage: PropTypes.func,
  // updateNotification: PropTypes.func,
  // handleUpload: PropTypes.func,
  updatePressPackage: PropTypes.func,
  packageUpdated: PropTypes.func
};

export default PressPackageDetailsForm;

// export default compose(
//   withRouter,
//   connect( null, reduxActions ),
//   graphql( CREATE_PRESS_PACKAGE_MUTATION, { name: 'createPressPackage' } ),
//   graphql( UPDATE_PRESS_PACKAGE_MUTATION, { name: 'updatePressPackage' } ),
//   graphql( PACKAGE_QUERY, {
//     partialRefetch: true,
//     skip: props => !props.id
//   } )
// )( PressPackageDetailsForm );
