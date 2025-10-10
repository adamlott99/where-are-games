import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HostingSlot, CreateHostingSlotRequest, UpdateHostingSlotRequest } from '../types';
import { hostingSlotsService } from '../services/api';

interface HostingSlotsContextType {
  slots: HostingSlot[];
  loading: boolean;
  error: string | null;
  fetchSlots: () => Promise<void>;
  createSlot: (slotData: CreateHostingSlotRequest) => Promise<void>;
  updateSlot: (id: number, slotData: UpdateHostingSlotRequest) => Promise<void>;
  deleteSlot: (id: number) => Promise<void>;
}

const HostingSlotsContext = createContext<HostingSlotsContextType | undefined>(undefined);

export const useHostingSlots = (): HostingSlotsContextType => {
  const context = useContext(HostingSlotsContext);
  if (context === undefined) {
    throw new Error('useHostingSlots must be used within a HostingSlotsProvider');
  }
  return context;
};

interface HostingSlotsProviderProps {
  children: ReactNode;
}

export const HostingSlotsProvider: React.FC<HostingSlotsProviderProps> = ({ children }) => {
  const [slots, setSlots] = useState<HostingSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const fetchedSlots = await hostingSlotsService.getAllSlots();
      setSlots(fetchedSlots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch hosting slots');
    } finally {
      setLoading(false);
    }
  };

  const createSlot = async (slotData: CreateHostingSlotRequest): Promise<void> => {
    try {
      await hostingSlotsService.createSlot(slotData);
      await fetchSlots(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  const updateSlot = async (id: number, slotData: UpdateHostingSlotRequest): Promise<void> => {
    try {
      await hostingSlotsService.updateSlot(id, slotData);
      await fetchSlots(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  const deleteSlot = async (id: number): Promise<void> => {
    try {
      await hostingSlotsService.deleteSlot(id);
      await fetchSlots(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const value: HostingSlotsContextType = {
    slots,
    loading,
    error,
    fetchSlots,
    createSlot,
    updateSlot,
    deleteSlot
  };

  return (
    <HostingSlotsContext.Provider value={value}>
      {children}
    </HostingSlotsContext.Provider>
  );
};
