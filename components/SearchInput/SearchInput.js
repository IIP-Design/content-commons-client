import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  Form, Input, Icon, Dropdown, Radio,
} from 'semantic-ui-react';
// import { detectLanguage } from 'lib/language';
import { getDirection } from 'lib/language';
import { fetchQueryString } from 'lib/searchQueryString';
import * as actions from 'lib/redux/actions';
import './SearchInput.scss';

const multipleTypes = ['video', 'post'];

class Search extends Component {
  constructor( props ) {
    super( props );
    const { search } = this.props;

    this.state = {
      locale: search.language,
      direction: 'left',
      selectedRadio: '',
      displayRadioGroup: '',
    };
  }


  displayRadio() {
    const {
      router: { pathname },
      isUser,
    } = this.props;

    if ( pathname === '/' && isUser ) {
      this.setState( { displayRadioGroup: true, selectedRadio: multipleTypes } );
    } else this.setState( { displayRadioGroup: false, selectedRadio: '' } );
  }

  componentDidMount() {
    this.maybeLoadLanguages();
    this.displayRadio();
  }

  componentDidUpdate( prevProps ) {
    const { router } = this.props;

    if ( router.pathname !== prevProps.router.pathname ) {
      this.onRouteChanged( router.pathname );
    }
  }

  onRouteChanged( pathname ) {
    this.maybeLoadLanguages();
    this.displayRadio();

    if ( pathname === '/' ) {
      this.setState( { locale: 'en-us', direction: 'left' } );
      this.props.updateSearchTerm( '' );
    } else {
      const { language } = this.props.search;

      this.setState( { locale: language, direction: getDirection( language ) } );
    }
  }

  /**
   * Send term to Google API to determine language
   * Update state if valid language detected
   */
  // getLanguage = async term => {
  //   const detected = await detectLanguage( term );
  //   if ( detected ) {
  //     this.setState( {
  //       locale: detected.language.key,
  //       direction: detected.direction,
  //     } );
  //   }
  // };

  handleLangOnChange = ( e, { value } ) => {
    this.setState( {
      locale: value,
      direction: getDirection( value ),
    } );
  };

  handleQueryOnChange = ( e, { value } ) => {
    // this.getLanguage( value );
    this.props.updateSearchTerm( value );
  };

  handleRadioChange = ( e, { value } ) => {
    this.setState( {
      selectedRadio: value,
    } );
  };

  handleSubmit = async () => {
    const { filter, search } = this.props;
    const query = fetchQueryString( { ...filter, term: search.term, language: this.state.locale, postTypes: this.state.selectedRadio } );

    this.props.router.push( {
      pathname: '/results',
      query,
    } );
  };

  handleSearchClick = e => {
    e.preventDefault();
    this.handleSubmit();
  };

  handleSearchKeyUp = e => {
    if ( e.key === 'Enter' ) {
      this.handleSubmit();
    }
  };

  maybeLoadLanguages() {
    const {
      router: { pathname },
      languages: { list },
    } = this.props;

    if ( pathname.indexOf( 'admin' ) === -1 && !list.length ) {
      this.props.loadLanguages();
    }
  }

  render() {
    let inputProps = {};

    if ( this.state.direction === 'left' ) {
      inputProps = { className: 'search_input' };
    } else {
      inputProps = { className: 'search_input right' };
    }

    let langOptions = this.props.languages.list.map( l => ( {
      key: l.key,
      text: l.display_name,
      value: l.key,
    } ) );

    if ( langOptions.length === 0 ) langOptions = [{ key: 'en-us', text: 'English', value: 'en-us' }];

    return (
      <section className="search_bar">
        <Form onSubmit={ this.handleSubmit }>
          {this.props.isUser && this.state.displayRadioGroup && (
            <Form.Group inline>
              <div className="radio-flex">
                <Radio
                  label="Articles and Videos"
                  name="radioGroup"
                  value={ multipleTypes }
                  checked={ this.state.selectedRadio === multipleTypes }
                  onChange={ this.handleRadioChange }
                />
                <Radio
                  label="Press Materials"
                  name="radioGroup"
                  value="document"
                  checked={ this.state.selectedRadio === 'document' }
                  onChange={ this.handleRadioChange }
                />
              </div>
            </Form.Group>
          )}
          <Input
            label={ (
              <Dropdown
                value={ this.state.locale }
                options={ langOptions }
                onChange={ this.handleLangOnChange }
              />
            ) }
            labelPosition="left"
            onChange={ this.handleQueryOnChange }
            value={ this.props.search.term ? this.props.search.term : '' }
            size="large"
            icon={ (
              <Icon
                tabIndex="0"
                name="search"
                onClick={ this.handleSearchClick }
                onKeyUp={ this.handleSearchKeyUp }
              />
            ) }
            placeholder="Type in keywords to search"
            { ...inputProps }
          />
        </Form>
      </section>
    );
  }
}

const mapStateToProps = state => ( {
  search: state.search,
  languages: state.global.languages,
  filter: state.filter,
  selectedRadio: state.selectedRadio,
  displayRadioGroup: state.displayRadioGroup,
} );

Search.propTypes = {
  router: PropTypes.object,
  filter: PropTypes.object,
  isUser: PropTypes.object,
  search: PropTypes.object,
  languages: PropTypes.object,
  loadLanguages: PropTypes.func,
  updateSearchTerm: PropTypes.func,
};

export default withRouter( connect( mapStateToProps, actions )( Search ) );
