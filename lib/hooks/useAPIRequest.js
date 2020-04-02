import { useState, useEffect } from 'react';
import { useAuth } from 'context/authContext';
import useIsMounted from 'lib/hooks/useIsMounted';

const useAPIRequest = ( apiRequestFn, params ) => {
  const isMounted = useIsMounted();

  const [response, setResponse] = useState( null );
  const [error, setError] = useState( null );

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const res = await apiRequestFn( ...params, user );
      if ( isMounted ) {
        setResponse( res );
      }
    } catch ( e ) {
      setError( error );
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
