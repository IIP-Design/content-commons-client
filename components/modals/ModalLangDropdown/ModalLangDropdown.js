import React, { useState } from 'react';
import { object, string, func } from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { getAvailableLanguages } from 'lib/elastic/query';
import './ModalLangDropdown.scss';

const ModalLangDropdown = props => {
  const { item, selected } = props;
  const [languages] = useState( item ? getAvailableLanguages( item ) : null );
  const [isOpen, setIsOpen] = useState( false );
  if ( languages && languages.length > 1 ) {
    return (
      <Dropdown
        className="modal_languages"
        value={ selected }
        icon={ isOpen ? 'chevron up' : 'chevron down' }
        options={ languages }
        onClick={ () => setIsOpen( !isOpen ) }
        onChange={ ( e, { value } ) => {
          setIsOpen( !isOpen );
          props.handleLanguageChange( value );
        } }
      />
    );
  }
  return <div className="modal_languages_single">{ selected }</div>;
};

ModalLangDropdown.propTypes = {
  item: object,
  selected: string,
  handleLanguageChange: func
};

export default ModalLangDropdown;
