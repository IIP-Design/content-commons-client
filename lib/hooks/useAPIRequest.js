import { useState, useEffect } from 'react';
import useIsMounted from 'lib/hooks/useIsMounted';
import { useAuth } from 'context/authContext';

const useAPIRequest = ( apiRequestFn, params ) => {
  const [response, setResponse] = useState( null );
  const [error, setError] = useState( null );
  const isMounted = useIsMounted();

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const res = await apiRequestFn( ...params, user );
      if ( isMounted ) {
        setResponse( res );
      }
    } catch ( e ) {
      if ( isMounted ) {
        setError( error );
      }
    }
  };

  useEffect( () => {
    fetchData();
  }, [user] );

  return {
    response,
    error
  };
};

export default useAPIRequest;
