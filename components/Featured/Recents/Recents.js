import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import moment from 'moment';
import { v4 } from 'uuid';
import {
  Grid, Header, Item, Modal, Message
} from 'semantic-ui-react';
import Video from 'components/Video/Video';
import Post from 'components/Post/Post';

import './Recents.scss';


class Recents extends Component {
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
      return ( index < arr.length - 1 ) ? `${c} · ` : c;
    }, '' );
    return categories;
  }

  renderRecentsWithMeta() {
    return this.props.recents.slice( 1 ).map( recent => (
      <Modal
        key={ v4() }
        closeIcon
        trigger={ (
          <Item className="recentsItem">
            <div
              className="recentsItem_img"
              style={ { backgroundImage: `url( ${recent.thumbnail} )` } }
            >
              <img src={ recent.icon } className="metaicon" alt={ `${this.props.postType} icon` } />
            </div>
            <Item.Content>
              <Item.Header>{ recent.title }</Item.Header>
              <div className="meta">
                <span className="date">{ moment( recent.published ).format( 'MMMM DD, YYYY' ) }</span>
                <span className="categories">{ this.getCategories( recent ) }</span>
              </div>
            </Item.Content>
          </Item>
        ) }
      >
        <Modal.Content>
          { this.getModalContent( recent ) }
        </Modal.Content>
      </Modal>
    ) );
  }

  render() {
    const {
      recents, postTypeLabels, postType, featured
    } = this.props;
    const postTypeLabel = postTypeLabels.find( type => type.key === postType );
    if ( recents && recents.length < 3 ) return <div />;
    return (
      <section className="ui container recents">
        <div className="recentswrapper">
          <div className="recentstitle">
            <Header as="h1" size="large">
              { postTypeLabel && `Latest ${postTypeLabel.display_name}s` }
            </Header>
            <Link
              href={ {
                pathname: '/results',
                query: { language: 'en-us', sortBy: 'published', postTypes: [this.props.postType] }
              } }
            >
              <a className="browseAll">Browse All</a>
            </Link>
          </div>
          { featured.error && (
            <Message>
              { `Oops, something went wrong.  We are unable to load the most recent ${postTypeLabel.display_name.toLowerCase()}s.` }
            </Message>
          ) }
          <Grid columns="equal" stackable stretched>
            <Grid.Column width={ 8 } className="recentsgridleft">
              { recents && recents[0]
              && (
              <Modal
                closeIcon
                trigger={ (
                  <div className="recentsleft" style={ { backgroundImage: `url( ${recents[0].thumbnail} )` } }>
                    <div className="recentsoverlay">
                      <div className="recentsoverlay_title">{ recents[0].title }</div>
                      <img
                        src={ recents[0].icon }
                        className="recentsoverlay_icon"
                        alt={ `${postType} icon` }
                      />
                    </div>
                  </div>
  ) }
              >
                <Modal.Content>
                  { this.getModalContent( recents[0] ) }
                </Modal.Content>
              </Modal>
              ) }
            </Grid.Column>
            <Grid.Column width={ 8 } className="recentsgridright">
              <Item.Group>{ recents && this.renderRecentsWithMeta() }</Item.Group>
            </Grid.Column>
          </Grid>
        </div>
      </section>

    );
  }
}

Recents.propTypes = {
  featured: PropTypes.object,
  recents: PropTypes.array,
  postType: PropTypes.string,
  postTypeLabels: PropTypes.array
};


const mapStateToProps = ( state, props ) => ( {
  featured: state.featured,
  recents: state.featured.recents[props.postType],
  postTypeLabels: state.global.postTypes.list
} );

export { Recents };
export default connect( mapStateToProps )( Recents );
