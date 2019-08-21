import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import moment from 'moment';
import { v4 } from 'uuid';
import {
  Grid, Header, Item, Modal, Loader, Message
} from 'semantic-ui-react';
import Video from 'components/Video/Video';
import Post from 'components/Post/Post';

import './Priorities.scss';


class Priorities extends Component {
  handleOnClick = e => {
    e.preventDefault();
    const categoryIds = this.props.categories.map( cat => cat.key );
    this.props.router.push( {
      pathname: '/results',
      query: {
        language: 'en-us', term: [this.props.term], categories: categoryIds, sortBy: 'relevance'
      }
    } );
  }

  getModalContent = item => {
    const noContent = <div>No content currently available</div>;
    if ( item ) {
      switch ( item.type ) {
        case 'video':
          return <Video item={ item } />;

        case 'post':
          return <Post item={ item } />;

        default:
          return noContent;
      }
    }
    return noContent;
  }

  getCategories = item => {
    const categories = item.categories.slice( 0, 3 ).reduce( ( acc, cat, index, arr ) => {
      const c = acc + cat.name.toLowerCase();
      return ( index < arr.length - 1 && index < 2 ) ? `${c} · ` : c;
    }, '' );
    return categories;
  }

  renderPrioritiesWithMeta() {
    return this.props.priorities.slice( 1 ).map( priority => (
      <Modal
        key={ v4() }
        closeIcon
        trigger={ (
          <Item className="prioritiesItem">
            <div
              className="prioritiesItem_img"
              style={ { backgroundImage: `url( ${priority.thumbnail} )` } }
            >
              <img src={ priority.icon } className="metaicon" alt="icon" />
            </div>
            <Item.Content>
              <Item.Header>{ priority.title }</Item.Header>
              <div className="meta">
                <span className="date">{ moment( priority.published ).format( 'MMMM DD, YYYY' ) }</span>
                <span className="categories">{ this.getCategories( priority ) }</span>
              </div>
            </Item.Content>
          </Item>
        ) }
      >
        <Modal.Content>
          { this.getModalContent( priority ) }
        </Modal.Content>
      </Modal>
    ) );
  }

  render() {
    const {
      priorities, featured, label
    } = this.props;
    if ( priorities && priorities.length < 3 ) return <div />;
    return (
      <section className="priorities">
        <div className="prioritiescontainer">
          <div className="prioritiestitle">
            <Header as="h1" size="large">
              { `Department Priority: ${label}` }
            </Header>
            <a href="/results" onClick={ this.handleOnClick } className="browseAll">
              { `Browse All` }
            </a>

          </div>
          <Loader active={ featured.loading } />
          { featured.error && (
            <Message>
              { `Oops, something went wrong.  We are unable to load the department priority section.` }
            </Message>
          ) }
          <Grid columns="equal" stackable stretched>
            <Grid.Column width={ 8 } className="prioritiesgridleft">
              { priorities && priorities[0]
              && (
              <Modal
                closeIcon
                trigger={ (
                  <div className="prioritiesleft" style={ { backgroundImage: `url( ${priorities[0].thumbnail} )` } }>
                    <div className="prioritiesoverlay">
                      <div className="prioritiesoverlay_title">{ priorities[0].title }</div>
                      <img
                        src={ priorities[0].icon }
                        className="prioritiesoverlay_icon"
                        alt="icon"
                      />
                    </div>
                  </div>
                ) }
              >
                <Modal.Content>
                  { this.getModalContent( priorities[0] ) }
                </Modal.Content>
              </Modal>
              )
              }
            </Grid.Column>
            <Grid.Column width={ 8 } className="prioritiesgridright">
              <Item.Group>{ priorities && this.renderPrioritiesWithMeta() }</Item.Group>
            </Grid.Column>
          </Grid>
        </div>
      </section>

    );
  }
}

Priorities.propTypes = {
  featured: PropTypes.object,
  priorities: PropTypes.array,
  term: PropTypes.string,
  label: PropTypes.string,
  categories: PropTypes.array,
  router: PropTypes.object
};


const mapStateToProps = ( state, props ) => ( {
  featured: state.featured,
  priorities: state.featured.priorities[props.term]
} );

export default withRouter( connect( mapStateToProps )( Priorities ) );
