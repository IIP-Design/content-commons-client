import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { titleCase } from 'lib/utils';

const TAG_QUERY = gql`
  query TAG_QUERY( $locale: String!) {
    tags {
      id
      translations( where: {
        language: {
          locale: $locale
        }
      } ) {
        id
        name
      }
    }
  }
`;

const TagDropdown = props => (
  <Query query={ TAG_QUERY } variables={ { locale: props.locale } }>
    { ( { data, loading, error } ) => {
      if ( error ) return 'Error!';
      if ( loading || !data ) return <p>Loading...</p>;

      let options = [];

      if ( data && data.tags ) {
        const tagsInLang = data.tags;
        options = tagsInLang
          .map( tag => ( {
            key: tag.id,
            text: tag.translations.length
              ? titleCase( tag.translations[0].name )
              : '',
            value: tag.id
          } ) )
          .sort( ( tagA, tagB ) => {
            const textA = tagA.text.toLowerCase();
            const textB = tagB.text.toLowerCase();
            if ( textA < textB ) return -1;
            if ( textA > textB ) return 1;
            return 0;
          } );
      }

      return (
        <Fragment>
          { !props.label && (
            <VisuallyHidden>
              <label htmlFor={ props.id }>{ `${props.id} tag` }</label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            className={ props.dir === 'RTL' ? 'rtl' : 'ltr' }
            id={ props.id }
            fluid
            loading={ loading }
            multiple
            name="tags"
            options={ options }
            search
            selection
            { ...props }
          />
        </Fragment>
      );
    } }
  </Query>
);

TagDropdown.defaultProps = {
  id: ''
};

TagDropdown.propTypes = {
  dir: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  locale: PropTypes.string
};

export default TagDropdown;
export { TAG_QUERY };
