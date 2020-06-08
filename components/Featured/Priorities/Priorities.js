import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import moment from 'moment';
import { connect } from 'react-redux';
import { v4 } from 'uuid';
import {
  Grid, Header, Item, Modal, Loader, Message,
} from 'semantic-ui-react';

import SignedUrlImage from 'components/SignedUrlImage/SignedUrlImage';
import { getModalContent } from 'components/modals/utils';

import './Priorities.scss';

const Priorities = ( { categories, featured, label, priorities, term } ) => {
  const getCategories = item => {
    const cats = item?.categories?.slice( 0, 3 ).reduce( ( acc, cat, index, arr ) => {
      const c = acc + cat.name.toLowerCase();

      return index < arr.length - 1 && index < 2 ? `${c} · ` : c;
    }, '' );

    return cats;
  };

  const renderPrioritiesWithMeta = () => priorities.slice( 1 ).map( priority => (
    <Modal
      key={ v4() }
      closeIcon
      trigger={ (
        <Item className="prioritiesItem">
          <SignedUrlImage className="prioritiesItem_img" url={ priority.thumbnail }>
            <img src={ priority.icon } className="metaicon" alt="icon" />
          </SignedUrlImage>
          <Item.Content>
            <Item.Header>{ priority.title }</Item.Header>
            <div className="meta">
              <span className="date">{ moment( priority.published ).format( 'MMMM DD, YYYY' ) }</span>
              <span className="categories">{ getCategories( priority ) }</span>
            </div>
          </Item.Content>
        </Item>
      ) }
    >
      <Modal.Content>
        { getModalContent( priority ) }
      </Modal.Content>
    </Modal>
  ) );

  if ( priorities && priorities.length < 3 ) return <div />;
  const categoryIds = categories?.map( cat => cat.key );

  return (
    <section className="priorities">
      <div className="prioritiescontainer">
        <div className="prioritiestitle">
          <Header as="h1" size="large">
            { `Department Priority: ${label}` }
          </Header>
          <Link
            href={ {
              pathname: '/results',
              query: {
                language: 'en-us', term, categories: categoryIds, sortBy: 'relevance',
              },
            } }
          >
            <a className="browseAll">Browse All</a>
          </Link>

        </div>
        <Loader active={ featured?.loading } />
        { featured?.error && (
          <Message>
            Oops, something went wrong.  We are unable to load the department priority section.
          </Message>
        ) }
        <Grid columns="equal" stackable stretched>
          <Grid.Column width={ 8 } className="prioritiesgridleft">
            { priorities && priorities[0] && (
              <Modal
                closeIcon
                trigger={ (
                  <SignedUrlImage className="prioritiesleft" url={ priorities[0].thumbnail }>
                    <div className="prioritiesoverlay">
                      <div className="prioritiesoverlay_title">{ priorities[0].title }</div>
                      <img
                        src={ priorities[0].icon }
                        className="prioritiesoverlay_icon"
                        alt="icon"
                      />
                    </div>
                  </SignedUrlImage>
                ) }
              >
                <Modal.Content>
                  { getModalContent( priorities[0] ) }
                </Modal.Content>
              </Modal>
            ) }
          </Grid.Column>
          <Grid.Column width={ 8 } className="prioritiesgridright">
            <Item.Group>{ priorities && renderPrioritiesWithMeta() }</Item.Group>
          </Grid.Column>
        </Grid>
      </div>
    </section>

  );
};

Priorities.propTypes = {
  featured: PropTypes.object,
  priorities: PropTypes.array,
  term: PropTypes.string,
  label: PropTypes.string,
  categories: PropTypes.array,
};


const mapStateToProps = ( state, props ) => ( {
  featured: state.featured,
  priorities: state.featured.priorities[props.term],
} );

export const PrioritiesUnconnected = Priorities; // used for testing; 1/2/20 - resolves import/no-named-as-default lint error
export default connect( mapStateToProps )( Priorities );
