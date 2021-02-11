import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import useSignedUrl from 'lib/hooks/useSignedUrl';
import { getOgTags } from './utils';

const PageMeta = ( { item, url } ) => {
  const { signedUrl } = useSignedUrl( item.thumbnail || '' );

  // Do not create social meta for internal only content to avoid potential data leakage
  if ( item.visibility && item.visibility === 'INTERNAL' ) return null;

  const meta = Object.entries( getOgTags( item, url ) );

  return (
    <Head>
      { meta && meta.map( tag => {
        const property = tag[0];
        const content = tag[1];

        return <meta key={ property } property={ property } content={ content } />;
      } ) }
      { signedUrl && <meta property="og:image" content={ signedUrl } /> }
    </Head>
  );
};

PageMeta.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string,
};

export default PageMeta;
