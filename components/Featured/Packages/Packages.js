import React from 'react';
import { Grid } from 'semantic-ui-react';
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

const Packages = props => (
  <section className="latestPackages" style={ styles.section }>
    <div style={ styles.container }>
      <div style={ styles.header }>
        <h1 style={ styles.title }>Latest Guidance Packages</h1>
        <a href="/" style={ styles.link }>Browse All</a>
      </div>
      <Grid columns="equal" stackable style={ styles.grid }>
        { [0, 1, 2, 3].map( i => (
          <Grid.Column key={ i }><Package /></Grid.Column>
        ) ) }
      </Grid>
    </div>
  </section>
);

export default Packages;
