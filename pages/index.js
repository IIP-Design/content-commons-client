import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

import Featured from 'components/Featured/Featured';

import { useDispatch } from 'react-redux';
import { clearFilters } from 'lib/redux/actions/filter';
import useIsMounted from 'lib/hooks/useIsMounted';

const { publicRuntimeConfig: { REACT_APP_UI_CONFIG } } = getConfig();

const Landing = () => {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [config, setConfig] = useState( {} );

  useEffect( () => {
    // Load ui config for landing page
    // NOTE: ui.json file located in iip-static-assets repo:
    // https://github.com/IIP-Design/iip-static-assets
    const fetchConfig = async () => {
      const result = await fetch( REACT_APP_UI_CONFIG );

      if ( isMounted ) {
        setConfig( await result.json() );
      }

      return {};
    };

    fetchConfig();
  }, [isMounted] );


  useEffect( () => {
    dispatch( clearFilters() );
  }, [dispatch] );

  return (
    <section>
      <Featured config={ config } />
    </section>
  );
};

export default Landing;
