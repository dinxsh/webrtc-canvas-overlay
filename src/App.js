import React from 'react';
import { observer } from 'mobx-react-lite';
import { createStore } from 'polotno/model/store';
import Header from './components/Header';
import PolotnoContainerComponent from './components/PolotnoContainer';
import { ResizePanel } from './components/resize-panel';
import { DEFAULT_SECTIONS } from 'polotno/side-panel';

const store = createStore({
  key: 'nFA5H9elEytDyPyvKL7T',
  showCredit: false,
});

store.addPage();

const ResizeSection = DEFAULT_SECTIONS.find(
  (section) => section.name === 'size'
);
ResizeSection.Panel = ResizePanel;

const App = observer(() => {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0f2f5', margin: 0 }}>
      <Header store={store} />
      <PolotnoContainerComponent store={store} />
    </div>
  );
});

export default App;