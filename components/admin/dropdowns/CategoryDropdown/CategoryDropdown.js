import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';

import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { getDirection } from 'lib/language';
import { titleCase } from 'lib/utils';

import '../dropdown.scss';

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

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

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
            className={ getDirection( props.locale ) === 'right' ? 'rtl' : 'ltr' }
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


export default React.memo( CategoryDropdown, areEqual );
export { CATEGORIES_QUERY };
