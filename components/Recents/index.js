import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import moment from 'moment';
import { v4 } from 'uuid';
import {
  Grid, Header, Item, Modal, Loader, Message
} from 'semantic-ui-react';
import { createStructuredSelector } from 'reselect';
import { makeSelectPostTypeLabel } from 'lib/redux/selectors/postTypes';
import {
  makeSelectRecentsByType,
  makeSelectRecentsWithMeta,
  makeSelectLoading,
  makeSelectError
} from './selectors';
import Video from '../Video/Video';
import Post from '../Post/Post';

import './Recents.scss';


class Recents extends Component {
  handleClick = () => {
    // console.log( 'clicked' );
    // e.preventDefault();
  }

  getModalContent = item => {
    const noContent = <div>No content currently avaialble</div>;
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

  renderRecentsWithMeta() {
    return this.props.recentsWithMeta.slice( 1 ).map( recent => (
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
                <span className="categories">{ recent.categories }</span>
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
      recents, recentsWithMeta, postType, postTypeLabel, loading, error
    } = this.props;

    return (
      <section className="recents">
        <div className="recentstitle">
          <Header as="h1" size="large">
Most Recent
            { ' ' }
            { this.props.postTypeLabel }
s
          </Header>

          <Link href={ `/results?postType=${postType}` }>
            <a>
              <span onClick={ this.handleClick } className="browseAll" role="presentation">
              Browse All
                { ' ' }
                { this.props.postTypeLabel }
s
              </span>
            </a>
          </Link>

        </div>
        <Loader active={ loading } />
        { error && (
          <Message>
            { `Oops, something went wrong.  We are unable to load the most recent ${postTypeLabel.toLowerCase()}s.` }
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
                      alt={ `${this.props.postType} icon` }
                    />
                  </div>
                </div>
) }
            >
              <Modal.Content>
                { this.getModalContent( recents[0] ) }
              </Modal.Content>
            </Modal>
            )
            }
          </Grid.Column>
          <Grid.Column width={ 8 } className="recentsgridright">
            <Item.Group>{ recentsWithMeta && this.renderRecentsWithMeta() }</Item.Group>
          </Grid.Column>
        </Grid>
      </section>

    );
  }
}

Recents.propTypes = {
  recents: PropTypes.array,
  recentsWithMeta: PropTypes.array,
  postType: PropTypes.string,
  postTypeLabel: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.bool
};


const mapStateToProps = ( state, props ) => createStructuredSelector( {
  postTypeLabel: makeSelectPostTypeLabel( props ),
  recents: makeSelectRecentsByType(),
  recentsWithMeta: makeSelectRecentsWithMeta(),
  loading: makeSelectLoading(),
  error: makeSelectError()
} );

export default connect( mapStateToProps )( Recents );
