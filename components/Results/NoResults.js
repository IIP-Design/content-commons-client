import React from 'react';
import { string } from 'prop-types';
import config from 'config';

const message = term => ( ( term )
  ? `Sorry, no matches found for "${term}"`
  : 'Sorry, no matches found' );

const NoResults = props => (
  <div className="results_noResults">
    <div className="results_help">
      <i className="results_help--nomatch">{ message( props.searchTerm ) }</i>
      <p>
        We are working to enhance the search functionality of Content Commons. If you continue to
        experience issues with your search results or are having trouble with a particular search term,
        <a
          href={ config.FEEDBACK_FORM_URL }
          target="_blank"
          className="footer_link"
          rel="noopener noreferrer"
        > let us know!
        </a>
      </p>
      <p>
        We will continue collecting analytics on what terms and phrases folks are searching in order to
        provide you a seamless search experience.
      </p>
      <div className="results_help--suggestions">
        <h3>Search suggestions</h3>
        <ul>
          <li>Check for spelling mistakes</li>
          <li>Broaden your search by using fewer or more general words</li>
          <li>Try different words that mean the same thing in the search box above</li>
        </ul>
      </div>
    </div>
  </div>
);

NoResults.propTypes = {
  searchTerm: string
};

export default NoResults;
