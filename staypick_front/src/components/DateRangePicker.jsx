import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/components/DateRangePicker.css';

const DateRangePicker = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const formatDate = (date) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd}`;
  };

  const handleChange = (update) => {
    setDateRange(update);
    if (onDateChange) {
      onDateChange(update[0], update[1]);
    }
  };

  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      onChange={handleChange}
      dateFormat="yyyy.MM.dd"
      placeholderText="날짜 선택"
      className="range-input"
    />
  );
};

export default DateRangePicker;
