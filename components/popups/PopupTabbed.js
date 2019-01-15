import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Tab } from 'semantic-ui-react';
import './Popup.scss';

class PopupTabbed extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      sliderStyle: {
        width: 0,
        left: 0
      },
      panes: this.props.panes.map( pane => ( {
        menuItem: pane.title,
        render: () => <Tab.Pane attached={ false }>{ pane.component }</Tab.Pane>
      } ) )
    };
  }

  componentDidMount() {
    this.initSliderStyle();
  }

  handleOnTabChange = e => {
    this.setState( {
      sliderStyle: {
        width: e.target.clientWidth,
        left: e.target.offsetLeft
      }
    } );
  };

  initSliderStyle() {
    const initActiveMenuItem = Array.from( document.querySelectorAll( '.popup .secondary.menu .active.item' ) )
      .filter( select => select.innerHTML === this.props.panes[0].title )[0];

    this.setState( {
      sliderStyle: {
        width: initActiveMenuItem.clientWidth,
        left: initActiveMenuItem.offsetLeft
      }
    } );
  }

  render() {
    return (
      <div>
        <Header as="h3">{ this.props.title }</Header>
        <div className="slider" style={ this.state.sliderStyle } />
        <Tab menu={ { secondary: true } } panes={ this.state.panes } onTabChange={ this.handleOnTabChange } />
      </div>
    );
  }
}

PopupTabbed.propTypes = {
  panes: PropTypes.array,
  title: PropTypes.string
};

export default PopupTabbed;
