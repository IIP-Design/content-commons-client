import React from 'react';
import { graphql } from 'react-apollo';

/**
 * A wrapper around `graphql()` that allows queries
 * to be dynamically generated based on props.
 * @see https://github.com/seangransee/react-apollo-dynamic-query
 *
 * @param {func} query GraphQL query
 * @param {object} config React Apollo config
 * @see https://www.apollographql.com/docs/react/api/react-apollo#graphql-config-options
 */
const graphqlDynamicHOC = ( query, config ) => (
  component => (
    function DynamicComponent( props ) {
      return React.createElement(
        graphql( query( props ), config )( component ),
        props
      );
    }
  )
);

export default graphqlDynamicHOC;
