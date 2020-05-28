import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import moment from 'moment';
import { v4 } from 'uuid';
import {
  Grid, Header, Item, Modal,
} from 'semantic-ui-react';

import SignedUrlImage from 'components/SignedUrlImage/SignedUrlImage';
import { getModalContent } from 'components/modals/utils';
import { FeaturedContext } from 'context/featuredContext';

import './Recents.scss';

const Recents = ( { postType } ) => {
  const { state } = useContext( FeaturedContext );

  const getCategories = item => {
    const categories = item.categories.slice( 0, 3 ).reduce( ( acc, cat, index, arr ) => {
      const c = acc + cat.name.toLowerCase();

      return index < arr.length - 1 ? `${c} · ` : c;
    }, '' );

    return categories;
  };

  // const postTypeLabel = postTypeLabels.find( type => type.key === postType );

  const recents = state?.recents?.[postType] ? state.recents[postType] : [];

  if ( recents.length < 3 ) return <div />;

  return (
    <section className="ui container recents">
      <div className="recentswrapper">
        <div className="recentstitle">
          <Header as="h1" size="large">
            {/* { postTypeLabel && `Latest ${postTypeLabel.display_name}s` } */}
          </Header>
          <Link
            href={ {
              pathname: '/results',
              query: {
                language: 'en-us',
                sortBy: 'published',
                postTypes: [postType],
              },
            } }
          >
            <a className="browseAll">Browse All</a>
          </Link>
        </div>
        <Grid columns="equal" stackable stretched>
          <Grid.Column width={ 8 } className="recentsgridleft">
            { recents && recents[0] && (
              <Modal
                closeIcon
                trigger={ (
                  <SignedUrlImage className="recentsleft" url={ recents[0].thumbnail }>
                    <div className="recentsoverlay">
                      <div className="recentsoverlay_title">{ recents[0].title }</div>
                      <img
                        src={ recents[0].icon }
                        className="recentsoverlay_icon"
                        alt={ `${postType} icon` }
                      />
                    </div>
                  </SignedUrlImage>
                ) }
              >
                <Modal.Content>{ getModalContent( recents[0] ) }</Modal.Content>
              </Modal>
            ) }
          </Grid.Column>
          <Grid.Column width={ 8 } className="recentsgridright">
            <Item.Group>
              { recents && recents.slice( 1 ).map( recent => (
                <Modal
                  key={ v4() }
                  closeIcon
                  trigger={ (
                    <Item className="recentsItem">
                      <SignedUrlImage className="recentsItem_img" url={ recent.thumbnail }>
                        <img src={ recent.icon } className="metaicon" alt={ `${postType} icon` } />
                      </SignedUrlImage>
                      <Item.Content>
                        <Item.Header>{ recent.title }</Item.Header>
                        <div className="meta">
                          <span className="date">{ moment( recent.published ).format( 'MMMM DD, YYYY' ) }</span>
                          <span className="categories">{ getCategories( recent ) }</span>
                        </div>
                      </Item.Content>
                    </Item>
                  ) }
                >
                  <Modal.Content>{ getModalContent( recent ) }</Modal.Content>
                </Modal>
              ) ) }
            </Item.Group>
          </Grid.Column>
        </Grid>
      </div>
    </section>
  );
};

Recents.propTypes = {
  postType: PropTypes.string,
  // postTypeLabels: PropTypes.array,
};

export default Recents;
