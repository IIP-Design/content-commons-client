import { useState, useEffect, useRef } from 'react';

/**
 * Execute a callback after a specified delay.  Clears timeout on completion
 * @param {function} cb function to execute after delay
 * @param {number} delay time to wait before executing callback
 * @usage
    const doSomething = () => {}
    const { startTimeout } = useTimeout( doSomething, 2000 );
 */
function useTimeout( cb, delay ) {
  const [isTimeoutActive, setIsTimeoutActive] = useState( false );
  const savedCallback = useRef();

  // Remember the latest cb.
  useEffect( () => {
    savedCallback.current = cb;
  }, [cb] );

  function clearTimeout() {
    setIsTimeoutActive( false );
  }

  function startTimeout() {
    setIsTimeoutActive( true );
  }

  useEffect( () => {
    function callback() {
      if ( savedCallback.current ) {
        savedCallback.current();
      }
      clearTimeout();
    }

    if ( isTimeoutActive ) {
      const timeout = window.setTimeout( callback, delay );

      return () => {
        window.clearTimeout( timeout );
      };
    }
  }, [isTimeoutActive, delay] );

  return {
    clearTimeout,
    startTimeout,
    stop: clearTimeout,
  };
}

export default useTimeout;
