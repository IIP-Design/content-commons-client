import React from 'react';
import { Placeholder } from 'semantic-ui-react';

const DocumentPaceholder = () => (
  <div style={ { border: '2px solid #eee' } }>
    <div style={ { margin: '20px' } }>
      <Placeholder>
        <Placeholder.Header>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
    </div>
  </div>
);

export default DocumentPaceholder;
