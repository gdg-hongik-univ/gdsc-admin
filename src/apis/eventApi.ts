// api/events.ts

import { apiClient } from ".";
import { EventResponse } from "@/types/dtos/event";

export const eventApi = {
  getEventList: async (page: number = 1, size: number = 20): Promise<EventResponse> => {
    const response = await apiClient.get<EventResponse>(`/admin/events?page=${page}&size=${size}`);
    return response.data;
  },
};
