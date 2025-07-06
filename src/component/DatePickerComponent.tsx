import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateTimePicker.css'; // 

type DatePickerComponentProps = {
  label?: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  showTimeSelect?: boolean;
  dateFormat?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  isClearable?: boolean;
};

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  label,
  selectedDate,
  onDateChange,
  showTimeSelect = true,
  dateFormat = 'Pp', // Default: Date + Time
  placeholder = 'Select date and time',
  minDate,
  maxDate,
  isClearable = false,
}) => {
  return (
    <div className="datetime-picker-row">
      {label && <label htmlFor="datetime-input">{label}</label>}
      <DatePicker
        id="datetime-input"
        selected={selectedDate}
        onChange={(date: Date | null) => onDateChange(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm"
        placeholderText="YYYY-MM-DD HH:mm"
        className="datetime-input"
      />
    </div>
  );
};

export default DatePickerComponent;
