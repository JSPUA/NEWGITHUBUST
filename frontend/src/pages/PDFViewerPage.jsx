import React from 'react';
import PDFViewer from './PDFViewer';

function PDFViewerPage({ match }) {
  const { id } = match.params;

  return (
    <div>
      <h2>PDF Viewer</h2>
      <PDFViewer id={id} />
    </div>
  );
}

export default PDFViewerPage;

