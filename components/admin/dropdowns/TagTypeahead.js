import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { titleCase } from 'lib/utils';

const TAG_QUERY = gql`
  query TAG_QUERY {
    tags {
      id
      translations {
        id
        name
        language { id }
      }
    }
  }
`;

const TagTypeahead = props => {
  const getTagsByLang = ( tags, langId ) => (
    tags.map( tag => ( {
      id: tag.id,
      translations: tag.translations.filter( translation => translation.language.id === langId )
    } ) )
  );

  return (
    <Query query={ TAG_QUERY } variables={ { langId: props.langId } }>
      { ( { data, loading, error } ) => {
        if ( error ) return `Error! ${error.message}`;
        if ( loading || !data ) return <p>Loading...</p>;

        let options = [];

        if ( data && data.tags ) {
          const tagsInLang = getTagsByLang( data.tags, props.langId );

          options = tagsInLang.map( tag => ( {
            key: tag.id,
            text: tag.translations.length
              ? titleCase( tag.translations[0].name )
              : '',
            value: tag.id
          } ) );
        }

        return (
          <Fragment>
            { !props.label && (

              <VisuallyHidden>
                { /* eslint-disable jsx-a11y/label-has-for */ }
                <label htmlFor={ props.id }>
                  { `${props.id} tag` }
                </label>
              </VisuallyHidden>
            ) }

            <Form.Dropdown
              id={ props.id }
              fluid
              loading={ loading }
              multiple
              name="tags"
              options={ options }
              placeholder="–"
              search
              selection
              { ...props }
            />
          </Fragment>
        );
      } }
    </Query>
  );
};

TagTypeahead.defaultProps = {
  id: ''
};

TagTypeahead.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  langId: PropTypes.string
};

export default TagTypeahead;
export { TAG_QUERY };
