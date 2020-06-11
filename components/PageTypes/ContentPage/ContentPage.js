import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import PageMeta from 'components/Meta/PageMeta';

import './ContentPage.module.scss';

const ContentPage = ( { children, item, url } ) => {
  if ( !item ) {
    return (
      <section className="max_width_1200" styleName="page">
        <p styleName="paragraph">Content Unavailable</p>
      </section>
    );
  }

  return (
    <Fragment>
      <PageMeta item={ item } url={ url } />
      <section className="max_width_1200" styleName="page">
        { children }
      </section>
    </Fragment>
  );
};

ContentPage.propTypes = {
  children: PropTypes.node,
  item: PropTypes.object,
  url: PropTypes.string,
};

export default ContentPage;
