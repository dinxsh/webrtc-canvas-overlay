import React from 'react';

const Header = ({ store }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '15px 30px', 
      backgroundColor: '#1f1f1f', 
      color: 'white',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
      fontFamily: 'Arial, sans-serif'
    }}>
      <a
        style={{
          fontSize: '28px',
          color: '#ffffff',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'color 0.3s',
        }}
        onMouseOver={(e) => e.target.style.color = '#00bfff'}
        onMouseOut={(e) => e.target.style.color = '#ffffff'}
      >
        GamerMatic
      </a>
      <div>
        <button
          onClick={async () => await store.saveAsHTML()}
          style={{
            padding: '12px 25px',
            backgroundColor: '#00bfff',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'background-color 0.3s, transform 0.3s',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#008fbf';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#00bfff';
            e.target.style.transform = 'scale(1)';
          }}
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default Header;