import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
import isEqual from 'lodash/isEqual';

import FormikAutoSave from 'components/admin/FormikAutoSave/FormikAutoSave';
import Notification from 'components/Notification/Notification';
import PackageForm from 'components/admin/PackageCreate/PackageForm/PackageForm';

import { packageSchema } from 'components/admin/PackageCreate/PackageForm/validationSchema';
import { buildUpdatePlaybookTree } from 'lib/graphql/builders/playbook';
import { UPDATE_PLAYBOOK_MUTATION } from 'lib/graphql/queries/playbook';
import useTimeout from 'lib/hooks/useTimeout';

const PlaybookDetailsFormContainer = props => {
  const { playbook, setIsFormValid } = props;

  const [updatePlaybook] = useMutation( UPDATE_PLAYBOOK_MUTATION );
  const [showNotification, setShowNotification] = useState( false );
  const hideNotification = () => setShowNotification( false );
  const { startTimeout } = useTimeout( hideNotification, 2000 );

  const getInitialValues = () => {
    let initialValues = {};

    const categories = playbook.categories
      ? playbook.categories.map( category => category.id )
      : [];

    const tags = playbook.tags ? playbook.tags.map( tag => tag.id ) : [];

    if ( playbook ) {
      initialValues = {
        title: playbook.title || '',
        type: playbook.type || '',
        team: playbook.team?.name || '',
        categories,
        tags,
        policy: playbook.policy?.id || '',
        visibility: playbook.visibility || 'INTERNAL',
        desc: playbook.desc || '',
      };
    }

    return initialValues;
  };


  const update = async ( values, prevValues ) => {
    const { id } = playbook;

    if ( id ) { // ensure we have a playbook
      try {
        await updatePlaybook( {
          variables: {
            data: buildUpdatePlaybookTree( values, prevValues ),
            where: { id },
          },
        } );
      } catch ( err ) {
        console.dir( err );
      }
    }
  };


  const save = async ( values, prevValues ) => {
    if ( !isEqual( values, prevValues ) ) {
      await update( values, prevValues );
      setShowNotification( true );
      startTimeout();
    }
  };

  const renderContent = formikProps => {
    setIsFormValid( formikProps.isValid );

    return (
      <div className="edit-playbook__form">
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

  return (
    <Formik
      initialValues={ getInitialValues() }
      validationSchema={ packageSchema }
    >
      { renderContent }
    </Formik>
  );
};

PlaybookDetailsFormContainer.propTypes = {
  children: PropTypes.node, // eslint-disable-line
  playbook: PropTypes.shape( {
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    team: PropTypes.object,
    categories: PropTypes.array,
    tags: PropTypes.array,
    policy: PropTypes.object,
    visibility: PropTypes.string,
    desc: PropTypes.string,
    supportFiles: PropTypes.array,
  } ),
  setIsFormValid: PropTypes.func,
};

export default PlaybookDetailsFormContainer;
