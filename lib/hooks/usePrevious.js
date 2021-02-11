import { useRef, useEffect } from 'react';

/**
 *
 * usePrevious hook for React
 *
 * @param {*} currentValue The value whose previous value is to be tracked
 * @returns {*} The previous value
 * @usage
    const myInput = useInput("hello world");
    const previousValue = usePrevious(myInput.value);
 */
function usePrevious( currentValue ) {
  const prevRef = useRef( null );

  useEffect( () => {
    prevRef.current = currentValue;
  }, [currentValue] );

  return prevRef.current;
}

export default usePrevious;
