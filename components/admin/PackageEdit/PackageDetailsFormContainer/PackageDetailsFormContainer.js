/**
 *
 * PackageDetailsFormContainer
 *
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
import useTimeout from 'lib/hooks/useTimeout';
import { buildUpdatePackageTree } from 'lib/graphql/builders/package';
import { UPDATE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';

import FormikAutoSave from 'components/admin/FormikAutoSave/FormikAutoSave';
import Notification from 'components/Notification/Notification';
import PackageForm from 'components/admin/PackageCreate/PackageForm/PackageForm';

import { baseSchema } from './validationSchema';

const PackageDetailsFormContainer = props => {
  const { pkg, setIsFormValid } = props;

  const [docNumber, setDocNumber] = useState( pkg?.documents ? pkg.documents.length : null );
  const [reinitialize, setReinitialize] = useState( false );

  useEffect( () => {
    if ( pkg?.documents && pkg.documents.length !== docNumber ) {
      setReinitialize( true );
      setDocNumber( pkg.documents.length );
    } else {
      setReinitialize( false );
    }
  }, [pkg] );

  const [updatePackage] = useMutation( UPDATE_PACKAGE_MUTATION );
  const [showNotification, setShowNotification] = useState( false );
  const hideNotification = () => setShowNotification( false );
  const { startTimeout } = useTimeout( hideNotification, 2000 );

  const update = async ( values, prevValues ) => {
    const { id } = pkg;

    if ( id ) { // ensure we have a package
      await updatePackage( {
        variables: {
          data: buildUpdatePackageTree( values, prevValues ),
          where: { id },
        },
      } ).catch( err => console.dir( err ) );
    }
  };

  /**
   * Workaround: Checks current values against previous values to see if an update is needed
   * This is a workaround as the Formik prev values are getting out of sync
   * with the previously saved values.  When the modal is opened and changes are
   * made to the values, these saved/updated values are lost along the way.
   * Need to investigate further and fix
   * @param {*} values
   */
  const isUpdateNeeded = ( values, prevValues ) => {
    if ( values.title !== prevValues.title || values.desc !== prevValues.desc ) return true;

    const { documents } = pkg;
    const hasChanged = documents.map( document => {
      const updatedDoc = values[document.id] || {};
      const documentChanged = Object.keys( updatedDoc ).map( key => {
        if ( !key || !document[key] ) return false;
        if ( key === 'use' ) {
          return updatedDoc[key] === document[key].id;
        }
        if ( Array.isArray( updatedDoc[key] ) ) {
          const flattened = document[key].map( item => item.id );

          return JSON.stringify( flattened ) === JSON.stringify( updatedDoc[key] );
        }

        return updatedDoc[key] === document[key];
      } );

      return documentChanged.every( currentValue => currentValue );
    } );

    return hasChanged.some( currentValue => !currentValue );
  };


  const save = async ( values, prevValues ) => {
    if ( isUpdateNeeded( values, prevValues ) ) {
      await update( values, pkg.documents );
      setShowNotification( true );
      startTimeout();
    }
  };

  // eslint-disable-next-line no-confusing-arrow
  const getDropdownIds = property => property && Array.isArray( property ) ? property.map( p => p.id ) : [];

  const getFiles = _pkg => {
    if ( _pkg ) {
      return _pkg.documents || [];
    }

    return [];
  };

  const getFileValues = array => array.reduce( ( acc, file ) => {
    const {
      id, bureaus, filename, countries, title, use, visibility,
    } = file;

    return {
      ...acc,
      [id]: {
        id,
        title: title || filename,
        bureaus: getDropdownIds( bureaus ),
        countries: getDropdownIds( countries ),
        use: use?.id || '',
        visibility,
      },
    };
  }, {} );

  const getInitialValues = () => {
    let initialValues = {};

    if ( pkg ) {
      const files = getFiles( pkg );

      initialValues = {
        title: pkg.title || '',
        type: pkg.type || '',
        desc: pkg.desc || '',
        team: pkg.team.name || '',
        ...getFileValues( files ),
      };
    }

    return initialValues;
  };

  const renderContent = formikProps => {
    setIsFormValid( formikProps.isValid );

    return (
      <div className="edit-package__form">
        <Notification
          el="p"
          customStyles={ {
            position: 'absolute',
            top: '9em',
            left: '50%',
            transform: 'translateX(-50%)',
          } }
          show={ showNotification }
          msg="Changes saved"
        />

        <FormikAutoSave save={ save } />
        <PackageForm
          { ...formikProps }
          { ...props }
        >
          { props.children }
        </PackageForm>
      </div>
    );
  };

  if ( !pkg ) return null;

  return (
    <Formik
      initialValues={ getInitialValues() }
      enableReinitialize={ reinitialize }
      validationSchema={ baseSchema }
    >
      { renderContent }
    </Formik>
  );
};

PackageDetailsFormContainer.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node, // eslint-disable-line
  pkg: PropTypes.shape( {
    id: PropTypes.string,
    title: PropTypes.string,
    team: PropTypes.object,
    desc: PropTypes.string,
    type: PropTypes.string,
    documents: PropTypes.array,
  } ),
  setIsFormValid: PropTypes.func,
};

export default PackageDetailsFormContainer;
