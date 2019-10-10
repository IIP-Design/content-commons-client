import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { titleCase } from 'lib/utils';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './dropdown.scss';

const CATEGORIES_QUERY = gql`
  query CATEGORIES_QUERY( $locale: String!) {
    categories {
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

/**
 *
 * @todo Update to display rtl categories correctly
 */
const CategoryDropdown = props => (
  <Query query={ CATEGORIES_QUERY } variables={ { locale: props.locale } }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data && data.categories ) {
        options = data.categories.map( category => ( {
          key: category.id,
          value: category.id,
          text: category.translations.length
            ? titleCase( category.translations[0].name )
            : ''
        } ) );
      }

      return (
        <Fragment>
          { !props.label && (
            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.id} categories` }
              </label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            id={ props.id }
            name="categories"
            options={ options }
            placeholder="–"
            loading={ loading }
            fluid
            selection
            { ...props }
          />
        </Fragment>
      );
    } }

  </Query>
);

CategoryDropdown.defaultProps = {
  id: '',
  locale: 'en-us'
};


CategoryDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  locale: PropTypes.string
};

export default CategoryDropdown;
export { CATEGORIES_QUERY };
