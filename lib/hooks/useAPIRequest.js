import { useState, useEffect } from 'react';
import { useAuth } from 'context/authContext';

const useAPIRequest = ( apiRequestFn, params ) => {
  const [response, setResponse] = useState( null );
  const [error, setError] = useState( null );

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const res = await apiRequestFn( ...params, user );
      setResponse( res );
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
