import React, { useState } from 'react';
import { useHostingSlots } from '../contexts/HostingSlotsContext';
import { HostingSlot } from '../types';
import './HostingSlotsList.css';

interface HostingSlotsListProps {
  onDeleteSlot: (id: number) => void;
}

const HostingSlotsList: React.FC<HostingSlotsListProps> = ({ onDeleteSlot }) => {
  const { slots, loading, error, createSlot } = useHostingSlots();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newSlot, setNewSlot] = useState({
    hosting_date: '',
    host_name: '',
    host_address: '',
    additional_notes: ''
  });
  const [submitError, setSubmitError] = useState<string>('');

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    return `${dayOfWeek} ${dateString}`;
  };

  const handleDelete = (id: number): void => {
    onDeleteSlot(id);
  };

  const handleAddClick = (): void => {
    setIsAdding(true);
    setSubmitError('');
  };

  const handleCancelAdd = (): void => {
    setIsAdding(false);
    setNewSlot({
      hosting_date: '',
      host_name: '',
      host_address: '',
      additional_notes: ''
    });
    setSubmitError('');
  };

  const handleInputChange = (field: string, value: string): void => {
    setNewSlot(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitAdd = async (): Promise<void> => {
    if (!newSlot.hosting_date || !newSlot.host_name || !newSlot.host_address) {
      setSubmitError('Date, Host, and Address are required');
      return;
    }

    try {
      await createSlot({
        hosting_date: newSlot.hosting_date,
        host_name: newSlot.host_name,
        host_address: newSlot.host_address,
        additional_notes: newSlot.additional_notes || undefined
      });
      handleCancelAdd();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add hosting slot';
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
              <th>Host</th>
              <th>Address</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot: HostingSlot) => (
              <tr key={slot.id} className="slot-row">
                <td className="slot-actions-cell">
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
                <td className="slot-host-cell">
                  {slot.host_name}
                </td>
                <td className="slot-address-cell">
                  {slot.host_address}
                </td>
                <td className="slot-notes-cell">
                  {slot.additional_notes || '-'}
                </td>
              </tr>
            ))}
            {!isAdding ? (
              <tr className="add-row">
                <td colSpan={5}>
                  <button className="add-button" onClick={handleAddClick}>
                    +
                  </button>
                </td>
              </tr>
            ) : (
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
