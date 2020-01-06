import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Message } from 'semantic-ui-react';
import Package from 'components/Package/Package';

const styles = {
  section: {
    padding: '2em',
    backgroundColor: '#f1f1f1',
  },
  container: {
    maxWidth: '1340px',
    margin: '0 auto',
    padding: '1em',
    backgroundColor: '#fff',
  },
  grid: {
    paddingBottom: '1em',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: '24px',
  },
  link: {
    fontSize: '14px',
    color: '#0071bc',
  }
};

const renderError = () => (
  <section className="latestPackages" style={ styles.section }>
    <Message>Oops, something went wrong.  We are unable to load the most recent guidance packages.</Message>
  </section>
);

const Packages = props => {
  const { featured, packages } = props;

  if ( featured.error ) {
    return renderError();
  }

  return (
    <section className="latestPackages" style={ styles.section }>
      <div style={ styles.container }>
        <div style={ styles.header }>
          <h1 style={ styles.title }>Latest Guidance Packages</h1>
          <a href="/" style={ styles.link }>Browse All</a>
        </div>
        <Grid columns="equal" stackable style={ styles.grid }>
          { packages.slice( 0, 4 ).map( pkg => (
            <Grid.Column key={ pkg.id }><Package item={ pkg } /></Grid.Column>
          ) ) }
        </Grid>
      </div>
    </section>
  );
};

Packages.propTypes = {
  featured: PropTypes.object,
  packages: PropTypes.array
};

const mapStateToProps = ( state, props ) => ( {
  featured: state.featured,
  packages: state.featured.recents[props.postType],
} );

export default connect( mapStateToProps )( Packages );
