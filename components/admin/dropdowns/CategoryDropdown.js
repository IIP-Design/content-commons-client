import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { titleCase } from 'lib/utils';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './dropdown.scss';

const CATEGORIES_QUERY = gql`
  query CATEGORIES_QUERY {
    categories {
    id
    translations {
      id
      name
      language {
        id
        locale
      }
    }
  }
  }
`;

/**
 *
 * @todo Update to display rtl categories correctly
 */
const CategoryDropdown = props => {
  /**
   *
   * @param {array} categories categories returned from graphql query
   * @param {*} locale  language in which to return categories
   */
  const getCategoriesByLocale = ( categories, locale = props.locale ) => categories.map( category => ( {
    id: category.id,
    translations: category.translations.filter( translation => translation.language.locale === locale )
  } ) );


  return (
    <Query query={ CATEGORIES_QUERY } variables={ { locale: 'en-us' } }>
      { ( { data, loading, error } ) => {
        if ( error ) return `Error! ${error.message}`;

        let options = [];
        if ( data && data.categories ) {
          const categoriesByLocale = getCategoriesByLocale( data.categories, props.locale );

          options = categoriesByLocale.map( category => ( {
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
};

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
