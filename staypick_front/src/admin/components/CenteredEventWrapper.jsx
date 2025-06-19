import React from 'react';

const CenteredEventWrapper = ({ children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      {children}
    </div>
  );
};

export default CenteredEventWrapper;
