import React, { useState } from 'react';
import { useHostingSlots } from '../contexts/HostingSlotsContext';
import { CreateHostingSlotRequest } from '../types';
import './HostingForm.css';

const HostingForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateHostingSlotRequest>({
    host_name: '',
    host_address: '',
    hosting_date: '',
    additional_notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { createSlot } = useHostingSlots();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await createSlot(formData);
      setSuccess('Hosting slot created successfully!');
      setFormData({
        host_name: '',
        host_address: '',
        hosting_date: '',
        additional_notes: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create hosting slot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="hosting-form-container">
      <div className="hosting-form">
        <h2>Volunteer to Host</h2>
        <p>Claim your spot for an upcoming event</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="host_name">Your Name *</label>
            <input
              type="text"
              id="host_name"
              name="host_name"
              value={formData.host_name}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="host_address">Address *</label>
            <input
              type="text"
              id="host_address"
              name="host_address"
              value={formData.host_address}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              placeholder="Enter the hosting address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hosting_date">Date *</label>
            <input
              type="date"
              id="hosting_date"
              name="hosting_date"
              value={formData.hosting_date}
              onChange={handleInputChange}
              min={getMinDate()}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="additional_notes">Additional Notes</label>
            <textarea
              id="additional_notes"
              name="additional_notes"
              value={formData.additional_notes}
              onChange={handleInputChange}
              disabled={isSubmitting}
              placeholder="Any special instructions (e.g., 'Please enter through the back door')"
              rows={3}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? 'Creating...' : 'Volunteer to Host'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HostingForm;
