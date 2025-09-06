// api/events.ts

import { apiClient } from ".";
import { EventParticipantsResponse, EventResponse } from "@/types/dtos/event";

export const eventApi = {
  getEventList: async (page: number = 1, size: number = 20): Promise<EventResponse> => {
    const response = await apiClient.get<EventResponse>(`/admin/events?page=${page}&size=${size}`);
    return response.data;
  },
  getParticipants: async (
    eventId: number,
    page: number = 0,
    size: number = 20,
  ): Promise<EventParticipantsResponse> => {
    const res = await apiClient.get<EventParticipantsResponse>(
      `/admin/event-participations/applicants`,
      { params: { event: eventId, page, size } },
    );
    return res.data;
  },
};
