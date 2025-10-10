import { Request, Response } from 'express';
import { database } from '../utils/database';
import { CreateHostingSlotRequest, UpdateHostingSlotRequest, ApiResponse, HostingSlot } from '../types';

export const getAllHostingSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const slots = await database.getAllUpcomingHostingSlots();
    const response: ApiResponse<HostingSlot[]> = {
      success: true,
      data: slots
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch hosting slots'
    };
    res.status(500).json(response);
  }
};

export const createHostingSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const slotData: CreateHostingSlotRequest = req.body;
    
    if (!slotData.host_name || !slotData.host_address || !slotData.hosting_date || !slotData.start_time) {
      const response: ApiResponse = {
        success: false,
        error: 'Host name, address, date, and start time are required'
      };
      res.status(400).json(response);
      return;
    }

    const hostingDate = new Date(slotData.hosting_date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (hostingDate < today) {
      const dayOfWeek = hostingDate.toLocaleDateString('en-US', { weekday: 'short' });
      const response: ApiResponse = {
        success: false,
        error: `${dayOfWeek} ${slotData.hosting_date} is in the past`
      };
      res.status(400).json(response);
      return;
    }

    const slotId = await database.createHostingSlot(slotData);
    
    const response: ApiResponse<{ id: number }> = {
      success: true,
      data: { id: slotId },
      message: 'Hosting slot created successfully'
    };
    res.status(201).json(response);
  } catch (error: any) {
    let errorMessage = 'Failed to create hosting slot';
    
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      const date = new Date(req.body.hosting_date + 'T00:00:00');
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      errorMessage = `${dayOfWeek} ${req.body.hosting_date} is already taken`;
    }
    
    const response: ApiResponse = {
      success: false,
      error: errorMessage
    };
    res.status(400).json(response);
  }
};

export const updateHostingSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const slotId = parseInt(req.params.id);
    const slotData: UpdateHostingSlotRequest = req.body;
    
    if (isNaN(slotId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid slot ID'
      };
      res.status(400).json(response);
      return;
    }

    if (!slotData.host_name || !slotData.host_address || !slotData.hosting_date || !slotData.start_time) {
      const response: ApiResponse = {
        success: false,
        error: 'Host name, address, date, and start time are required'
      };
      res.status(400).json(response);
      return;
    }

    const hostingDate = new Date(slotData.hosting_date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (hostingDate < today) {
      const dayOfWeek = hostingDate.toLocaleDateString('en-US', { weekday: 'short' });
      const response: ApiResponse = {
        success: false,
        error: `${dayOfWeek} ${slotData.hosting_date} is in the past`
      };
      res.status(400).json(response);
      return;
    }

    const updated = await database.updateHostingSlot(slotId, slotData);
    
    if (!updated) {
      const response: ApiResponse = {
        success: false,
        error: 'Hosting slot not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Hosting slot updated successfully'
    };
    res.json(response);
  } catch (error: any) {
    let errorMessage = 'Failed to update hosting slot';
    
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      const date = new Date(req.body.hosting_date + 'T00:00:00');
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      errorMessage = `${dayOfWeek} ${req.body.hosting_date} is already taken`;
    }
    
    const response: ApiResponse = {
      success: false,
      error: errorMessage
    };
    res.status(400).json(response);
  }
};

export const deleteHostingSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const slotId = parseInt(req.params.id);
    
    if (isNaN(slotId)) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid slot ID'
      };
      res.status(400).json(response);
      return;
    }

    const deleted = await database.deleteHostingSlot(slotId);
    
    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Hosting slot not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Hosting slot deleted successfully'
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete hosting slot'
    };
    res.status(500).json(response);
  }
};
