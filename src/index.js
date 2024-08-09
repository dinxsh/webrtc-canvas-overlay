import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { PagesTimeline } from 'polotno/pages-timeline';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';

import '@blueprintjs/core/lib/css/blueprint.css';

import { createStore } from 'polotno/model/store';

const store = createStore({
  key: 'nFA5H9elEytDyPyvKL7T',
  showCredit: true,
});
store.addPage();

const exportAsHTML = (setOverlayHTML) => {
  const elements = store.pages[0].children.map((element) => {
    const { x, y, width, height, rotation, type, ...rest } = element;
    let style = `position: absolute; left: ${x}px; top: ${y}px; width: ${width}px; height: ${height}px; transform: rotate(${rotation}deg);`;

    if (type === 'text') {
      style += ` font-size: ${rest.fontSize}px; color: ${rest.fill};`;
      return `<div style="${style}">${rest.text}</div>`;
    } else if (type === 'image') {
      return `<img src="${rest.src}" style="${style}" />`;
    }
    return '';
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="Exported Canvas Overlay">
      <meta name="author" content="Your Name">
      <title>Canvas Export</title>
      <style>
        body { 
          margin: 0; 
          padding: 0; 
          font-family: Arial, sans-serif; 
          background-color: transparent; 
          overflow: auto; /* Allow scrolling */
        }
        .canvas-container { 
          position: relative; 
          width: 100%; 
          height: 100vh; 
          overflow: auto; /* Allow scrolling */
        }
        .canvas-container div, .canvas-container img, .canvas-container video {
          position: absolute;
        }
      </style>
    </head>
    <body>
      <div class="canvas-container">
        ${elements}
      </div>
    </body>
    </html>
  `;

  setOverlayHTML(htmlContent);

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  a.click();
};

const App = () => {
  const [overlayHTML, setOverlayHTML] = useState('');

  useEffect(() => {
    const video = document.getElementById('video');
    if (video) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
      });
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        padding: '10px', 
        backgroundColor: '#f8f9fa', 
        top: 0, 
        zIndex: 1000 
      }}>
        <a
          style={{
            fontSize: 20,
            color: '#007bff',
            textDecoration: 'none',
          }}
        >
          GamerMatic
        </a>
        <button
          onClick={() => exportAsHTML(setOverlayHTML)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Export as HTML
        </button>
      </div>

      <div style={{ position: 'relative', flex: 1 }}>
        <div
          dangerouslySetInnerHTML={{ __html: overlayHTML }}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}
        />
      </div>

      <PolotnoContainer style={{ flex: 1, display: 'flex' }}>
        <SidePanelWrap>
          <SidePanel store={store} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar store={store} downloadButtonEnabled />
          <Workspace store={store} />
          <ZoomButtons store={store} />
          <PagesTimeline store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);