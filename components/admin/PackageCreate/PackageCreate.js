import React, { useState } from 'react';
import Router from 'next/router';
import { Formik } from 'formik';
import { guidanceSchema, packageSchema } from './PackageForm/validationSchema';
import moment from 'moment';

import ApolloError from 'components/errors/ApolloError';
import ProjectHeader from '../ProjectHeader/ProjectHeader';
import PackageForm from './PackageForm/PackageForm';
import ButtonPackageCreate from './ButtonPackageCreate/ButtonPackageCreate';
import Checkbox from './PackageForm/Checkbox/Checkbox';

import { useMutation } from '@apollo/client';
import {
  CREATE_PACKAGE_MUTATION,
  PACKAGE_EXISTS_QUERY,
} from 'lib/graphql/queries/package';
import { CREATE_PLAYBOOK_MUTATION } from 'lib/graphql/queries/playbook';
import { buildCreatePlaybookTree } from 'lib/graphql/builders/playbook';
import { buildCreatePackageTree } from 'lib/graphql/builders/package';

import styles from './PackageCreate.module.scss';
import { useAuth } from 'context/authContext';


const PackageCreate = () => {
  const { user } = useAuth();
  const [pkg, setPkg] = useState( null );

  const [creationError, setCreationError] = useState( '' );
  const [createPlaybook] = useMutation( CREATE_PLAYBOOK_MUTATION );
  const [createPackage] = useMutation( CREATE_PACKAGE_MUTATION );
  const [packageExists] = useMutation( PACKAGE_EXISTS_QUERY );

  /**
   * Checks whether a package exists with the supplied field name and values
   * @param {object} where clause containing fields to test existence against, i.e. { title: Daily Guidance }
   * @returns bool
   */
  const doesPackageExist = async where => {
    const res = await packageExists( {
      variables: {
        where,
      },
    } );

    return res.data.packageExists;
  };

  /**
   * Convenience func to execute graphql create mutations
   * @param {func} creator create mutation
   * @param {func} builder func to transform form values to applicable package type format
   * @param {object} values form values
   * @returns Promise
   */
  const executeCreate = async ( creator, builder, values ) => creator( {
    variables: {
      data: builder( values ),
    },
  } );

  /**
  * Create guidance package and send user to
  * package edit screen on success.
  * @returns void
  */
  const createGuidancePackage = async values => {
    const { title, type } = values;
    const _values = {
      title,
      type,
      userId: user.id,
      teamId: user.team.id,
    };

    if ( await doesPackageExist( { title } ) ) {
      setCreationError( `A Guidance Package with the name "${title}" already exists.` );

      return;
    }

    try {
      const res = await executeCreate( createPackage, buildCreatePackageTree, _values );

      setPkg( res.data.createPackage );

      return res.data.createPackage;
    } catch ( err ) {
      setCreationError( err );
    }
  };

  /**
  * Create playbook package and send user to
  * playbook edit screen on success.
  * @returns void
  */
  const createPlaybookPackage = async values => {
    const _values = { ...values };

    // Remove values
    delete _values.visibility;
    delete _values.termsConditions;

    _values.userId = user.id;
    _values.teamId = user.team.id;

    try {
      const res = await executeCreate( createPlaybook, buildCreatePlaybookTree, _values );

      Router.push( `/admin/package/playbook/${res.data.createPlaybook.id}` );
    } catch ( err ) {
      setCreationError( err );
    }
  };

  /**
   * Send user back to upload screen
   */
  const returnToUpload = () => {
    Router.push( '/admin/upload' );
  };

  /**
   * Seed initial form values based on team and content types
   * @param {object} team object
   * @returns object
   */
  const getInitialValues = () => {
    let title = '';
    let type = '';
    const contentTypes = user?.team?.contentTypes ? user.team.contentTypes : [];

    // if press office, pre-populate the title and type
    if ( user?.team?.name === 'GPA Press Office' ) {
      title = `Guidance Package ${moment().format( 'MM-D-YY' )}`;
      type = 'DAILY_GUIDANCE';

    // if team can only author 1 contentType, set type
    } else if ( contentTypes.length === 1 ) {
      [type] = contentTypes;
    }

    return {
      title,
      type,
      team: user?.team?.name,
      categories: [],
      tags: [],
      policy: '',
      visibility: 'INTERNAL',
      desc: '',
      termsConditions: false,
    };
  };

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
        validationSchema={ user?.team?.name === 'GPA Press Office' ? guidanceSchema : packageSchema }
        validateOnMount
      >
        { formikProps => (
          <PackageForm { ...formikProps }>
            <div className={ styles['form-child'] }>
              <ButtonPackageCreate
                pkg={ pkg }
                formikProps={ formikProps }
                createGuidancePackage={ createGuidancePackage }
                createPlaybookPackage={ createPlaybookPackage }
              />
              <div className={ styles.terms }>
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
