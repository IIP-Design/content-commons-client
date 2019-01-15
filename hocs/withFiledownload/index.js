import React, { Component } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';

const withFileDownload = ( WrappedComponent ) => {
  class HOC extends Component {
    constructor( props ) {
      super( props );
      this.ENDPOINT = `${process.env.REACT_APP_PUBLIC_API}/v1/task/download`;
      this.state = {
        error: ''
      };
    }

    download = ( url, title, locale, id = '' ) => {
      const ext = url.substr( url.lastIndexOf( '.' ) );
      id = ( id ) ? `.${id}` : '';
      let filename = `${title}.${locale}${id}${ext}`;
      filename = filename.replace( /(\s|-)/g, '_' ).toLowerCase();
      axios
        .post( this.ENDPOINT, { url, filename }, { responseType: 'blob' } )
        .then( ( response ) => {
          FileSaver.saveAs( response.data, filename );
        } )
        .catch( ( err ) => {
          this.setState( {
            error: `Oops there was a problem downloading your file: ${err.message}`
          } );
        } );
    }

    render() {
      return <WrappedComponent { ...this.props } download={ this.download } error={ this.state.error } />;
    }
  }

  return HOC;
};

export default withFileDownload;
