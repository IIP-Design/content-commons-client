import { useState, useEffect } from 'react';

const useAPIRequest = apiRequestFn => {
  const [response, setResponse] = useState( null );
  const [error, setError] = useState( null );

  useEffect( () => {
    const fetchData = async () => {
      try {
        const res = await apiRequestFn();
        setResponse( res );
      } catch ( e ) {
        setError( error );
      }
    };
    fetchData();
  }, [] );

  return { response, error };
};

export default useAPIRequest;
