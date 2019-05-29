import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';

import './dropdown.scss';

const LANGUAGES_QUERY = gql`
  query LANGUAGES_QUERY {
    languages {
      id
      displayName
      locale
    }
  }
`;


const LanguageDropdown = props => (
  <Query query={ LANGUAGES_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];
      if ( data && data.languages ) {
        const getFilteredList = allLangs => (
          allLangs.filter( lang => {
            const { locale } = lang;
            return props.locales.includes( locale );
          } )
        );

        const languages = props.locales ? getFilteredList( data.languages ) : data.languages;

        options = sortBy( languages, lang => lang.displayName )
          .map( lang => ( { key: lang.id, text: lang.displayName, value: lang.id } ) );
      }

      return (
        <Fragment>
          { !props.label && (

            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.id} language` }
              </label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            id={ props.id }
            name="language"
            options={ options }
            placeholder="–"
            loading={ loading }
            fluid
            search
            selection
            { ...props }
          />
        </Fragment>
      );
    } }

  </Query>
);

LanguageDropdown.defaultProps = {
  id: ''
};


LanguageDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  locales: PropTypes.array
};

export default LanguageDropdown;
export { LANGUAGES_QUERY };
