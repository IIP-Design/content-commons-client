import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './dropdown.scss';

const LANGUAGES_QUERY = gql`
  query LANGUAGES_QUERY {
    languages {
      id
      displayName
    }
  }
`;


const LanguageDropdown = props => (
  <Query query={ LANGUAGES_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];
      if ( data && data.languages ) {
        options = data.languages.map( lang => ( { key: lang.id, text: lang.displayName, value: lang.id } ) );
      }

      return (
        <Dropdown
          id={ props.id }
          name="language"
          onChange={ props.onChange }
          options={ options }
          placeholder="–"
          value={ props.selected }
              // error={ !selectedLanguage }
          fluid
          selection
          loading={ loading }
        />
      );
    } }


  </Query>
);

LanguageDropdown.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func
};

export default LanguageDropdown;
export { LANGUAGES_QUERY };
