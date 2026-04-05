import React from 'react';
import { Commet } from 'react-loading-indicators';

const Load = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Commet color="#32cd32" size="medium" text="" textColor="" />
    </div>
  );
};

export default Load;
