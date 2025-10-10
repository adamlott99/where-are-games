import React, { useState } from 'react';
import { useHostingSlots } from '../contexts/HostingSlotsContext';
import { HostingSlot } from '../types';
import './HostingSlotsList.css';

interface HostingSlotsListProps {
  onDeleteSlot: (id: number) => void;
}

const HostingSlotsList: React.FC<HostingSlotsListProps> = ({ onDeleteSlot }) => {
  const { slots, loading, error, createSlot, updateSlot } = useHostingSlots();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newSlot, setNewSlot] = useState({
    hosting_date: '',
    host_name: '',
    host_address: '',
    start_time: '',
    additional_notes: ''
  });
  const [submitError, setSubmitError] = useState<string>('');

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/Chicago' });
    return `${dayOfWeek} ${dateString}`;
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    return timeString;
  };



  const handleDelete = (id: number): void => {
    onDeleteSlot(id);
  };

  const handleEditClick = (slot: HostingSlot): void => {
    setEditingId(slot.id);
    setNewSlot({
      hosting_date: slot.hosting_date,
      host_name: slot.host_name,
      host_address: slot.host_address,
      start_time: slot.start_time,
      additional_notes: slot.additional_notes || ''
    });
    setSubmitError('');
  };

  const handleAddClick = (): void => {
    setIsAdding(true);
    setSubmitError('');
  };

  const handleCancelAdd = (): void => {
    setIsAdding(false);
    setEditingId(null);
    setNewSlot({
      hosting_date: '',
      host_name: '',
      host_address: '',
      start_time: '',
      additional_notes: ''
    });
    setSubmitError('');
  };

  const handleInputChange = (field: string, value: string): void => {
    setNewSlot(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitAdd = async (): Promise<void> => {
    if (!newSlot.hosting_date || !newSlot.host_name || !newSlot.host_address || !newSlot.start_time) {
      setSubmitError('Date, Host, Address, and Start Time are required');
      return;
    }

    try {
      if (editingId) {
        await updateSlot(editingId, {
          hosting_date: newSlot.hosting_date,
          host_name: newSlot.host_name,
          host_address: newSlot.host_address,
          start_time: newSlot.start_time,
          additional_notes: newSlot.additional_notes || undefined
        });
      } else {
        await createSlot({
          hosting_date: newSlot.hosting_date,
          host_name: newSlot.host_name,
          host_address: newSlot.host_address,
          start_time: newSlot.start_time,
          additional_notes: newSlot.additional_notes || undefined
        });
      }
      handleCancelAdd();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save hosting slot';
      setSubmitError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading hosting slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="hosting-slots-list">
      <div className="slots-table-container">
        <table className="slots-table">
          <thead>
            <tr>
              <th></th>
              <th>Date</th>
              <th>Time</th>
              <th>Host</th>
              <th>Address</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot: HostingSlot) => (
              <tr key={slot.id} className="slot-row">
                {editingId === slot.id ? (
                  <>
                    <td className="slot-actions-cell">
                      <button
                        className="save-button"
                        onClick={handleSubmitAdd}
                        title="Save changes"
                      >
                        ✓
                      </button>
                      <button
                        className="cancel-button"
                        onClick={handleCancelAdd}
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </td>
                    <td className="slot-date-cell">
                      <input
                        type="date"
                        value={newSlot.hosting_date}
                        onChange={(e) => handleInputChange('hosting_date', e.target.value)}
                        className="inline-input"
                      />
                    </td>
                    <td className="slot-time-cell">
                      <input
                        type="time"
                        value={newSlot.start_time}
                        onChange={(e) => handleInputChange('start_time', e.target.value)}
                        className="inline-input"
                      />
                    </td>
                    <td className="slot-host-cell">
                      <input
                        type="text"
                        value={newSlot.host_name}
                        onChange={(e) => handleInputChange('host_name', e.target.value)}
                        placeholder="Host name"
                        className="inline-input"
                      />
                    </td>
                    <td className="slot-address-cell">
                      <input
                        type="text"
                        value={newSlot.host_address}
                        onChange={(e) => handleInputChange('host_address', e.target.value)}
                        placeholder="Address"
                        className="inline-input"
                      />
                    </td>
                    <td className="slot-notes-cell">
                      <input
                        type="text"
                        value={newSlot.additional_notes}
                        onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                        placeholder="Notes"
                        className="inline-input"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="slot-actions-cell">
                      <button
                        className="edit-button"
                        onClick={() => handleEditClick(slot)}
                        title="Edit hosting slot"
                      >
                        ✎
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(slot.id)}
                        title="Cancel hosting commitment"
                      >
                        ✕
                      </button>
                    </td>
                    <td className="slot-date-cell">
                      {formatDate(slot.hosting_date)}
                    </td>
                    <td className="slot-time-cell">
                      {formatTime(slot.start_time)}
                    </td>
                    <td className="slot-host-cell">
                      {slot.host_name}
                    </td>
                    <td className="slot-address-cell">
                      {slot.host_address}
                    </td>
                    <td className="slot-notes-cell">
                      {slot.additional_notes || '-'}
                    </td>
                  </>
                )}
              </tr>
            ))}
            {isAdding && !editingId && (
              <tr className="edit-row">
                <td className="slot-actions-cell">
                  <button
                    className="save-button"
                    onClick={handleSubmitAdd}
                    title="Save"
                  >
                    ✓
                  </button>
                  <button
                    className="cancel-button"
                    onClick={handleCancelAdd}
                    title="Cancel"
                  >
                    ✕
                  </button>
                </td>
                <td className="slot-date-cell">
                  <input
                    type="date"
                    value={newSlot.hosting_date}
                    onChange={(e) => handleInputChange('hosting_date', e.target.value)}
                    className="inline-input"
                  />
                </td>
                <td className="slot-time-cell">
                  <input
                    type="time"
                    value={newSlot.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    className="inline-input"
                  />
                </td>
                <td className="slot-host-cell">
                  <input
                    type="text"
                    value={newSlot.host_name}
                    onChange={(e) => handleInputChange('host_name', e.target.value)}
                    placeholder="Host name"
                    className="inline-input"
                  />
                </td>
                <td className="slot-address-cell">
                  <input
                    type="text"
                    value={newSlot.host_address}
                    onChange={(e) => handleInputChange('host_address', e.target.value)}
                    placeholder="Address"
                    className="inline-input"
                  />
                </td>
                <td className="slot-notes-cell">
                  <input
                    type="text"
                    value={newSlot.additional_notes}
                    onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                    placeholder="Notes"
                    className="inline-input"
                  />
                </td>
              </tr>
            )}
            {!isAdding && !editingId && (
              <tr className="add-row">
                <td colSpan={6}>
                  <button className="add-button" onClick={handleAddClick}>
                    +
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {submitError && (
        <div className="inline-error-message">{submitError}</div>
      )}
    </div>
  );
};

export default HostingSlotsList;
