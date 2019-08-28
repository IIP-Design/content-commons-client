import { useRef, useEffect } from 'react';

/**
 * Returns the component mount state
 * @usage
   const isMounted = useIsMounted();
   if ( isMounted ) {
      doSomething();
    }
 */
const useIsMounted = () => {
  const isMountRef = useRef( true );
  useEffect( () => {
    isMountRef.current = false;
  }, [] );
  return isMountRef.current;
};

export default useIsMounted;
