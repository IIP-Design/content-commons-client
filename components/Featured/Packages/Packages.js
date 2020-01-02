import React from 'react';
import Package from 'components/Package/Package';

const styles = {
  title: {
    fontSize: '24px',
  },
};

const Packages = props => (
  <section className="ui container latestPackages">
    <h1 style={ styles.title }>Latest Guidance Packages</h1>
    <Package />
  </section>
);

export default Packages;
