import { useState, useEffect } from 'react';
import { useAuth } from 'context/authContext';

const useAPIRequest = ( apiRequestFn, params ) => {
  const [response, setResponse] = useState( null );
  const [error, setError] = useState( null );

  const { user } = useAuth();

  useEffect( () => {
    let abortAPIRequest = false;

    const fetchData = async () => {
      try {
        const res = await apiRequestFn( ...params, user );

        if ( !abortAPIRequest ) {
          setResponse( res );
        }
      } catch ( e ) {
        if ( !abortAPIRequest ) {
          setError( error );
        }
      }
    };

    fetchData();

    return () => { abortAPIRequest = true; };
  }, [user] );

  return {
    response,
    error,
  };
};

export default useAPIRequest;
