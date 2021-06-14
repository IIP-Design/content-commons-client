import { Fragment } from 'react';
import PropTypes from 'prop-types';

import ErrorSection from 'components/errors/ErrorSection';
import PageMeta from 'components/Meta/PageMeta';

const ContentPage = ( { children, fullWidth, item, url } ) => {
  if ( !item ) {
    return (
      <section className="max_width_1200">
        <ErrorSection statusCode={ 404 } title="Content Unavailable" />
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
