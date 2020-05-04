import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { getItemRequest } from 'lib/elastic/api';
import GraphicProject from 'components/GraphicProject/GraphicProject';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';
import { populateMetaArray } from 'lib/socialHeaders';
import { fetchUser } from 'context/authContext';
import Head from 'next/head';

/** For Preview Graphic Modal Testing on line 47-59 - REMOVE */
import { Modal } from 'semantic-ui-react';
import { graphicElasticMock } from 'components/GraphicProject/graphicElasticMock';
import { graphicGraphqlMock } from 'components/GraphicProject/graphicGraphqlMock';
/** END MODAL TESTING */

const styles = {
  page: {
    marginTop: '90px'
  },
  paragraph: {
    fontSize: '2em',
    fontWeight: 700
  }
};

const GraphicPage = props => {
  const { item, url } = props;

  if ( !item ) {
    return (
      <section className="max_width_1200" style={ styles.page }>
        <p style={ styles.paragraph }>Content Unavailable</p>
      </section>
    );
  }

  const metaTags = populateMetaArray( item, url );

  return (
    <Fragment>
      <Head>
        { metaTags && metaTags.map( tag => <meta key={ tag.property } property={ tag.property } content={ tag.content } /> ) }
      </Head>
      <section className="max_width_1200" style={ styles.page }>
        <GraphicProject item={ item } />
      </section>

      {/* TESTING */}
      <section style={ { marginTop: '50px' } }>
        <h3>TEST GRAPHIC PREVIEW MODAL</h3>
        <Modal
          closeIcon
          trigger={ <p>Preview</p> }
        >
          <Modal.Content>
            <GraphicProject item={ graphicGraphqlMock } displayAsModal isAdminPreview useGraphQl />
          </Modal.Content>
        </Modal>
      </section>
      {/* END TESTING */}

    </Fragment>
  );
};

GraphicPage.getInitialProps = async ctx => {
  const { req, query, asPath } = ctx;
  const user = await fetchUser( ctx );

  const url = req && req.headers && req.headers.host && asPath
    ? `https://${req.headers.host}${asPath}`
    : '';

  if ( query && query.site && query.id ) {
    // const response = await getItemRequest( query.site, query.id, user );
    // const item = getDataFromHits( response );

    /** * TESTING - REMOVE ** */
    const item = { ...graphicElasticMock };
    /** END TESTING * */

    if ( item && item[0] ) {
      return {
        item: normalizeItem( item[0], query.language ),
        url
      };
    }
  }

  return {};
};

GraphicPage.propTypes = {
  item: PropTypes.object,
  url: PropTypes.string
};

export default GraphicPage;
