import React, { Component } from 'react';
import { object, string, func } from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { getAvailableLanguages } from '../../../lib/elastic/query';
import './ModalLangDropdown.scss';

class ModalLangDropdown extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      isOpen: false,
      languages: this.props.item ? getAvailableLanguages( this.props.item ) : null
    };

    this.toggleArrow = this.toggleArrow.bind( this );
    this.handleChange = this.handleChange.bind( this );
  }

  toggleArrow() {
    this.setState( { isOpen: !this.state.isOpen } );
  }

  handleChange( e, { value } ) {
    this.toggleArrow();
    this.props.handleLanguageChange( value );
  }

  render() {
    const { selected } = this.props;
    const { languages } = this.state;

    if ( languages && languages.length > 1 ) {
      return (
        <Dropdown
          className="modal_languages"
          value={ selected }
          icon={ this.state.isOpen ? 'chevron up' : 'chevron down' }
          options={ this.state.languages }
          onClick={ this.toggleArrow }
          onChange={ this.handleChange }
        />
      );
    }
    return <div className="modal_languages_single">{ selected }</div>;
  }
}

ModalLangDropdown.propTypes = {
  item: object,
  selected: string,
  handleLanguageChange: func
};

export default ModalLangDropdown;
