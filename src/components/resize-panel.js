import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, FormGroup, InputGroup } from "@blueprintjs/core";

const AVAILABLE_SIZES = [
  { width: 1280, height: 720, label: "HD" },
  { width: 1920, height: 1080, label: "Full HD" },
  { width: 2560, height: 1440, label: "Quad HD" },
  { width: 3840, height: 2160, label: "4K" },
];

const styles = {
  card: {
    padding: '30px',
    margin: '30px',
    backgroundColor: '#e0e4e8',
    borderRadius: '10px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  button: {
    width: '100%',
    marginBottom: '15px',
    backgroundColor: '#005fa3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '12px 0',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#004080', 
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#222',
  },
  input: {
    marginBottom: '15px',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #bbb',
  },
  inputGroup: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
  },
  customSizeButton: {
    marginTop: '15px',
  },
};

export const ResizePanel = observer(({ store }) => {
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const handleCustomSize = () => {
    const width = parseInt(customWidth, 10);
    const height = parseInt(customHeight, 10);
    if (!isNaN(width) && !isNaN(height)) {
      store.setSize(width, height);
    }
  };

  return (
    <Card style={styles.card}>
      <FormGroup label="Enter Size" labelFor="custom-size-inputs" style={styles.formGroup} labelInfo={<span style={styles.label}></span>}>
        <div style={styles.inputGroup}>
          <InputGroup
            id="custom-width"
            placeholder="Width"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            style={styles.input}
          />
          <InputGroup
            id="custom-height"
            placeholder="Height"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            style={styles.input}
          />
        </div>
        <Button
          style={{ ...styles.button, ...styles.customSizeButton }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
          onClick={handleCustomSize}
        >
          Apply Custom Size
        </Button>
      </FormGroup>
      <FormGroup label="" labelFor="canvas-size-buttons" style={styles.formGroup} labelInfo={<span style={styles.label}>Select Canvas Size</span>}>
        <div id="canvas-size-buttons">
          {AVAILABLE_SIZES.map(({ width, height, label }, i) => (
            <Button
              key={i}
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
              onClick={() => {
                store.setSize(width, height);
              }}
            >
              {label} ({width} x {height})
            </Button>
          ))}
        </div>
      </FormGroup>
    </Card>
  );
});