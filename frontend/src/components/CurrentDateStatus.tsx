import React from 'react';
import { useHostingSlots } from '../contexts/HostingSlotsContext';
import { HostingSlot } from '../types';
import './CurrentDateStatus.css';

const CurrentDateStatus: React.FC = () => {
  const { slots } = useHostingSlots();

  const getCurrentDateString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayOfWeek} ${dateString}`;
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
        <p>{todaySlot.host_name} — {todaySlot.host_address}</p>
        {todaySlot.additional_notes && (
          <p className="notes">{todaySlot.additional_notes}</p>
        )}
      </div>
    </div>
  );
};

export default CurrentDateStatus;
