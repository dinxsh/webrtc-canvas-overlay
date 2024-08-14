import React from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { observer } from 'mobx-react-lite';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { PagesTimeline } from 'polotno/pages-timeline';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel, DEFAULT_SECTIONS } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import {
  TextSection,
  PhotosSection,
  ElementsSection,
  UploadSection,
  BackgroundSection,
  SizeSection,
  LayersSection,
  VideosSection
} from 'polotno/side-panel';
import { SectionTab } from 'polotno/side-panel';
import FaShapes from '@meronex/icons/fa/FaShapes';
import { CustomData } from './customData';

const DataSection = {
  name: 'Data',
  Tab: (props) => (
    <SectionTab name="Data" {...props}>
      <FaShapes icon="new-text-box" />
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    return CustomData;
  }),
};

const sections = [TextSection, SizeSection, PhotosSection, VideosSection,  UploadSection, BackgroundSection,  DataSection,  LayersSection, ElementsSection,];

const PolotnoContainerComponent = ({ store }) => {
  return (
    <PolotnoContainer style={{ flex: 1, display: 'flex' }}>
      <SidePanelWrap>
        <SidePanel store={store} sections={sections} defaultSection="size" />
      </SidePanelWrap>
      <WorkspaceWrap>
        <Toolbar store={store} />
        <Workspace 
          store={store} 
          backgroundColor="#f5f5f5"
          pageBorderColor="#dcdcdc"
          activePageBorderColor="#007acc"
          bleedColor="rgba(0, 122, 204, 0.1)" 
          paddingX={50}
          paddingY={50}
          altCloneEnabled={true}
        />
        <ZoomButtons store={store} />
        <PagesTimeline store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
};

export default PolotnoContainerComponent;