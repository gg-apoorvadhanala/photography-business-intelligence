import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Tool to fetch photography shoot data
 *
 * Mock data structure:
 * - Date (YYYY-MM-DD)
 * - Client
 * - Shoot Type (Portrait, Wedding, Event, Product, etc.)
 * - Start Time (HH:MM AM/PM)
 * - End Time (HH:MM AM/PM)
 * - Amount Charged ($)
 * - Payment Method (Venmo, Cash, etc.)
 */

export const getPhotographyShootsTool = createTool({
  id: 'get-photography-shoots',
  description: 'Get photography shoot data including bookings, rates, and revenue',
  inputSchema: z.object({}),
  outputSchema: z.object({
    csvData: z.string(),
  }),
  execute: async () => {
    return await getPhotographyShoots();
  },
});

const getPhotographyShoots = async () => {
  // Mock data for testing - replace with real data source later
  const mockData = `Date,Client,Shoot Type,Start Time,End Time,Amount Charged,Payment Method
2024-01-15,Sarah Johnson,Portrait,2:00 PM,4:00 PM,300,Venmo
2024-01-20,Mike & Emma,Wedding,10:00 AM,6:00 PM,2500,Venmo
2024-02-03,TechCorp,Product,1:00 PM,3:00 PM,400,Bank Transfer
2024-02-10,Lisa Chen,Portrait,3:00 PM,5:00 PM,280,Venmo
2024-02-14,David & Rachel,Engagement,11:00 AM,1:00 PM,500,Venmo
2024-03-05,Local Business,Event,5:00 PM,9:00 PM,800,Cash
2024-03-12,Jennifer Smith,Portrait,1:00 PM,3:00 PM,300,Venmo
2024-03-25,Anderson Wedding,Wedding,12:00 PM,8:00 PM,3000,Bank Transfer
2024-04-08,Marcus Brown,Portrait,10:00 AM,12:00 PM,250,Venmo
2024-04-15,StartupXYZ,Product,2:00 PM,5:00 PM,600,Bank Transfer
2024-05-01,Taylor & Jordan,Wedding,11:00 AM,7:00 PM,2800,Venmo
2024-05-20,Emma Wilson,Portrait,4:00 PM,6:00 PM,300,Venmo`;

  return { csvData: mockData };
};
