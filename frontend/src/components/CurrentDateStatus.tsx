import React from 'react';
import { useHostingSlots } from '../contexts/HostingSlotsContext';
import { HostingSlot } from '../types';
import './CurrentDateStatus.css';

const CurrentDateStatus: React.FC = () => {
  const { slots } = useHostingSlots();

  const getCurrentDateString = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const currentDate = getCurrentDateString();
  const todaySlot = slots.find((slot: HostingSlot) => slot.hosting_date === currentDate);

  if (!todaySlot) {
    return (
      <div className="current-date-status">
        <h2 className="status-heading">Where are games today?</h2>
        <div className="status-unclaimed">
          <p>Nowhere</p>
        </div>
      </div>
    );
  }

  return (
    <div className="current-date-status">
      <h2 className="status-heading">Where are games today?</h2>
      <div className="status-claimed">
        <p>{todaySlot.host_name} — {todaySlot.host_address} — {todaySlot.start_time}</p>
        {todaySlot.additional_notes && (
          <p className="notes">{todaySlot.additional_notes}</p>
        )}
      </div>
    </div>
  );
};

export default CurrentDateStatus;
