/**
 *
 * PackageDetailsFormContainer
 *
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Formik } from 'formik';
import { Loader } from 'semantic-ui-react';
import useTimeout from 'lib/hooks/useTimeout';
import { buildPackageFormTree } from 'lib/graphql/builders/package';
import { PACKAGE_FILES_QUERY, UPDATE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';
import ApolloError from 'components/errors/ApolloError';
import Notification from 'components/Notification/Notification';
import PackageDetailsForm from './PackageDetailsForm/PackageDetailsForm';
import { initialSchema, baseSchema } from './validationSchema';

const PackageDetailsFormContainer = props => {
  const { loading, error, data } = useQuery( PACKAGE_FILES_QUERY, {
    partialRefetch: true,
    variables: { id: props.id },
    skip: !props.id
  } );
  const [updatePackage] = useMutation( UPDATE_PACKAGE_MUTATION );
  const [showNotification, setShowNotification] = useState( false );
  const hideNotification = () => setShowNotification( false );
  const { startTimeout } = useTimeout( hideNotification, 2000 );

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
          content="Loading package details form..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !data ) return null;

  const update = async ( values, prevValues ) => {
    const { id } = props;
    if ( id ) { // ensure we have a package
      await updatePackage( {
        variables: {
          data: buildPackageFormTree( values, prevValues ),
          where: { id }
        },
      } ).catch( err => console.dir( err ) );
    }
  };

  const save = async ( values, prevValues ) => {
    await update( values, prevValues );
    setShowNotification( true );
    startTimeout();
  };

  const getDropdownIds = property => (
    property.map( p => p.id )
  );

  const getPackage = () => (
    ( data && data.pkg ) ? data.pkg : {}
  );

  const getFiles = pkg => {
    if ( pkg ) {
      return pkg.documents || [];
    }
    return [];
  };

  const getFileValues = array => (
    array.reduce( ( acc, file ) => {
      const {
        id, bureaus, filename, tags, use, visibility
      } = file;
      return {
        ...acc,
        [id]: {
          fileTitle: filename,
          bureaus: getDropdownIds( bureaus ),
          tags: getDropdownIds( tags ),
          use: use.id,
          visibility
        }
      };
    }, {} )
  );

  const getInitialValues = () => {
    const pkg = getPackage();
    const files = getFiles( pkg );

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
        { props.children }
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
  children: PropTypes.node // eslint-disable-line
};

export default PackageDetailsFormContainer;
