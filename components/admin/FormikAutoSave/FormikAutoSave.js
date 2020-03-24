import {
  useEffect, useCallback, useState
} from 'react';
import debounce from 'lodash/debounce';
import useIsMounted from 'lib/hooks/useIsMounted';
import { connect } from 'formik';

/**
 * Saves Formik form using debounce at an interval of debounceMs
 * connect() exposes the formik props to component
 *
 * @param {object} props Props from parent component
 */
const FormikAutoSave = props => {
  const isMounted = useIsMounted();

  const {
    save, debounceMs, formik: {
      validateForm, values
    }
  } = props;

  // Stores last saved form values. Helpful when values need to be removed from form
  // i.e. disconnecting nodes in grqaphql
  const [prevValues, setPrevValues] = useState( values );

  /**
   * Execute provide save function, sending previous values along
   * @param {object} updatedValues Form values that have changed since last save
   */
  const _save = async updatedValues => {
    await save( updatedValues, prevValues );
  };

  /**
   * Executes provided save function at the provided debounceMs timeout (default: 500)
   * Uses useCallback hook to create a memoized version of debouncedSave. This ensures that
   * the same debouncedSave function is persisted between renders. Without useCallback, a new
   * debouncedSave function would be created with each render resulting in a save call with every keystroke
   *
   * @param {object } updatedValues Form values that have changed since last save
   */
  const debouncedSave = useCallback(
    async updatedValues => {
      const errors = await validateForm( updatedValues );
      const hasErrors = Object.keys( errors ).length > 0;

      if ( !hasErrors ) {
        debounce(
          async () => _save( updatedValues ),
          debounceMs
        )();
      }
    }, [debounceMs]
  );

  useEffect( () => {
    if ( !isMounted ) { // do not save on mount
      debouncedSave( values );
    }

    setPrevValues( values );
  }, [values] );

  return null;
};


FormikAutoSave.defaultProps = {
  debounceMs: 500
};


export default connect( FormikAutoSave );
