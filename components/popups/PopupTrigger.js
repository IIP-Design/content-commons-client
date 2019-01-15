import React, { Component } from 'react';
import { Popup, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import '../../styles/tooltip.scss';

class PopupTrigger extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      isMobile: false
    };
  }

  componentDidMount() {
    this.isMobile();
  }

  isMobile = () => {
    if ( window.outerWidth < 600 ) {
      this.setState( { isMobile: true } );
    }
  };


  render() {
    // const trigger = withTooltip( <Button>my button </Button> );
    return (
      <span style={ { display: this.props.show ? 'inline-block' : 'none' } }>
        <Popup
          trigger={ (
            <Button className="trigger" tooltip={ this.props.toolTip }>
              <img
                src={ this.props.icon.img }
                width={ this.props.icon.dim }
                height={ this.props.icon.dim }
                alt={ this.props.toolTip }
              />
              { ' ' }
            </Button>
) }
          on="click"
          onOpen={ this.handleOnOpen }
          onClose={ this.handleOnClose }
          className={ !this.state.isMobile ? 'popupElem_wrapper' : 'popupElem_wrapper popupElem_wrapper--mobile' }
          content={ this.props.content }
          horizontalOffset={ 4 }
          position={ this.state.isMobile ? 'bottom center' : 'bottom right' }
        />
      </span>
    );
  }
}

PopupTrigger.propTypes = {
  toolTip: PropTypes.string,
  icon: PropTypes.object,
  content: PropTypes.node,
  show: PropTypes.bool
};

export default PopupTrigger;
