import React from 'react';
import '../css/CustomToolbar.css';

const CustomToolbar = ({ label, onNavigate }) => {
  return (
    <div className="calendar-custom-toolbar">
      <button onClick={() => onNavigate('PREV')}>&lt;</button>
      <span>{label}</span>
      <button onClick={() => onNavigate('NEXT')}>&gt;</button>
    </div>
  );
};

export default CustomToolbar;
