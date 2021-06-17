import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import ApolloError from 'components/errors/ApolloError';
import ButtonPackageCreate from './ButtonPackageCreate/ButtonPackageCreate';
import Checkbox from './PackageForm/Checkbox/Checkbox';
import PackageForm from './PackageForm/PackageForm';
import ProjectHeader from '../ProjectHeader/ProjectHeader';

import { guidanceSchema, createPackageSchema } from './PackageForm/validationSchema';
import { PACKAGE_TYPE_QUERY } from 'components/admin/dropdowns/PackageTypeDropdown/PackageTypeDropdown';
import { useAuth } from 'context/authContext';

import styles from './PackageCreate.module.scss';

const PackageCreate = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [teamPackageTypes, setTeamPackageTypes] = useState( [] );
  const [schema, setSchema] = useState( guidanceSchema );

  const [creationError, setCreationError] = useState( '' );
  const { data, loading } = useQuery( PACKAGE_TYPE_QUERY );

  useEffect( () => {
    const getTeamPackageTypes = ( types = [] ) => {
      const packageTypes = data?.__type.enumValues.map( value => value.name );
      const _types = types.filter( type => type === 'PACKAGE' || packageTypes.includes( type ) );

      return _types;
    };

    if ( data ) {
      const _teamPackageTypes = getTeamPackageTypes( user?.team?.contentTypes );
      const _schema = _teamPackageTypes.length === 1 && _teamPackageTypes[0] === 'PACKAGE'
        ? guidanceSchema
        : createPackageSchema;

      setTeamPackageTypes( _teamPackageTypes );
      setSchema( _schema );
    }
  }, [data, user] );


  /**
   * Changes schema when package type is switched
   * @param {string} type package type, e.g. PLAYBOOK
   */
  const updateSchema = type => {
    const _schema = type === 'DAILY_GUIDANCE' ? guidanceSchema : createPackageSchema;

    setSchema( _schema );
  };

  /**
   * Display errors message
   * @param {string} error
   */
  const setError = error => {
    setCreationError( error );
  };


  /**
   * Send user back to upload screen
   */
  const returnToUpload = () => {
    router.push( '/admin/upload' );
  };

  const getPackageType = types => ( ( types.length === 1 ) ? types[0] : '' );
  const getPackageTitle = type => ( ( type === 'PACKAGE' || type === 'DAILY_GUIDANCE' )
    ? `Guidance Package ${moment().format( 'MM-D-YY' )}`
    : '' );

  /**
   * Seed initial form values based on team and content types
   * @param {object} team object
   * @returns object
   */
  const getInitialValues = type => {
    const packageType = type || getPackageType( teamPackageTypes );
    const title = getPackageTitle( packageType );

    return {
      title,
      type: packageType,
      team: user?.team?.name,
      categories: [],
      tags: [],
      policy: '',
      visibility: 'INTERNAL',
      desc: '',
      termsConditions: false,
    };
  };

  const reset = ( type, setValues, setTouched ) => {
    updateSchema( type );

    setTouched( {
      title: false,
      categories: false,
      termsConditions: false,
    } );

    setValues( {
      team: user?.team?.name,
      title: getPackageTitle( type ),
      type,
      categories: [],
      tags: [],
      policy: '',
      desc: '',
    } );
  };

  if ( loading ) {
    return 'Loading form...';
  }

  return (
    <div className={ styles['package-create'] }>
      <div className="header">
        <ProjectHeader text="Package Details">
          <button
            type="button"
            className={ styles['btn-cancel'] }
            onClick={ returnToUpload }
            aria-label="Return to upload screen"
          >
            Cancel
          </button>
        </ProjectHeader>
      </div>

      <ApolloError error={ { otherError: creationError } } />

      <Formik
        initialValues={ getInitialValues() }
        enableReinitialize
        validationSchema={ schema }
        validateOnMount
      >
        { formikProps => (
          <PackageForm
            { ...formikProps }
            packageTypes={ teamPackageTypes }
            reset={ reset }
          >
            <div className={ styles.container }>
              <div className={ styles['container-btn'] }>
                <ButtonPackageCreate
                  user={ user }
                  setError={ setError }
                />
              </div>
              <div className={ styles['container-terms'] }>
                <Checkbox
                  id="termsConditions"
                  name="termsConditions"
                  required
                >
                  <small>
                    For any files I upload, I agree to the Content Commons Terms of Use
                    and licensing agreements.
                  </small>
                </Checkbox>
              </div>
            </div>
          </PackageForm>
        ) }
      </Formik>

    </div>
  );
};

export default PackageCreate;
