import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
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
        <Fragment>
          { /* eslint-disable jsx-a11y/label-has-for */ }
          <VisuallyHidden>
            <label htmlFor={ props.id }>
              { `${props.forFn} language` }
            </label>
          </VisuallyHidden>

          <Dropdown
            id={ props.id }
            name="language"
            onChange={ props.onChange }
            options={ options }
            placeholder="–"
            value={ props.selected }
              // error={ !selectedLanguage }
            fluid
            required={ props.required }
            selection
            loading={ loading }
          />
        </Fragment>
      );
    } }


  </Query>
);

LanguageDropdown.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func,
  forFn: PropTypes.string,
  required: PropTypes.bool,
};

export default LanguageDropdown;
export { LANGUAGES_QUERY };
