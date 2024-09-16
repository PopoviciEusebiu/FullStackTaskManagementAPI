import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../styles/calendar.css';
import 'react-calendar/dist/Calendar.css';


function MyCalendar({}) {
    const [date, setDate] = useState(new Date());

    const onChange = (newDate) => {
        localStorage.setItem("initialDate", newDate);
        setDate(newDate);

    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={onChange}
                value={date}
                calendarType="gregory"
            />
        </div>
    );
}

export default MyCalendar;
