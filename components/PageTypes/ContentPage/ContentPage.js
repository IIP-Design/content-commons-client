import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import PageMeta from 'components/Meta/PageMeta';

const style = {
  // page: {
  //   marginTop: '90px',
  // },
  paragraph: {
    fontSize: '2em',
    fontWeight: '700',
  },
};

const ContentPage = ( { children, fullWidth, item, url } ) => {
  if ( !item ) {
    return (
      <section className="max_width_1200">
        <p style={ style.paragraph }>Content Unavailable</p>
      </section>
    );
  }

  return (
    <Fragment>
      <PageMeta item={ item } url={ url } />
      <section className={ fullWidth ? '' : 'max_width_1200' }>
        { children }
      </section>
    </Fragment>
  );
};

ContentPage.propTypes = {
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  item: PropTypes.object,
  url: PropTypes.string,
};

export default ContentPage;
