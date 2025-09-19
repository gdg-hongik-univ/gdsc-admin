// api/events.ts

import { apiClient } from ".";
import {
  CreateEventRequest,
  EventParticipantsResponse,
  EventResponse,
  EventType,
  SearchMemberListResponse,
  UpdateBasicInfoEventRequest,
  UpdateEventFormRequest,
  UpdateEventRequest,
} from "@/types/dtos/event";

export const eventApi = {
  createEvent: async (eventData: CreateEventRequest) => {
    const response = await apiClient.post("/admin/events", eventData);
    return response.data;
  },
  updateEvent: async (eventId: number, eventData: UpdateEventRequest): Promise<EventType> => {
    const response = await apiClient.put<EventType>(`/admin/events/${eventId}`, eventData);
    return response.data;
  },
  updateBasicInfoEvent: async (eventId: number, eventData: UpdateBasicInfoEventRequest) => {
    const response = await apiClient.put(`/admin/events/${eventId}/basic-info`, eventData);
    return response.data;
  },
  updateEventForm: async (eventId: number, eventData: UpdateEventFormRequest) => {
    const response = await apiClient.put(`/admin/events/${eventId}/form-info`, eventData);
    return response.data;
  },
  getEventList: async (page: number = 1, size: number = 20): Promise<EventResponse> => {
    const response = await apiClient.get<EventResponse>(`/admin/events?page=${page}&size=${size}`);
    return response.data;
  },
  getParticipants: async (
    eventId: number,
    page: number = 0,
    size: number = 20,
    sort: string = "",
  ): Promise<EventParticipantsResponse> => {
    const res = await apiClient.get<EventParticipantsResponse>(
      `/admin/event-participations/applicants`,
      { params: { event: eventId, page, size, sort } },
    );
    return res.data;
  },
  getSearchMemberList: async (
    eventId: number,
    name: string,
  ): Promise<SearchMemberListResponse[]> => {
    const response = await apiClient.get<SearchMemberListResponse[]>(
      `/admin/event-participations/members/participable/search`,
      { params: { event: eventId, name } },
    );
    return response.data;
  },
  postParticipants: async (eventId: number, memberId: number) => {
    const response = await apiClient.post(`/admin/event-participations/apply/manual/registered`, {
      eventId: eventId,
      memberId: memberId,
    });
    return response.data;
  },
  postMemberParticipants: async (
    eventId: number,
    participant: { name: string; studentId: string; phone: string },
  ) => {
    const response = await apiClient.post(`/admin/event-participations/apply/manual`, {
      eventId: eventId,
      participant,
    });
    return response.data;
  },
  deleteParticipants: async (eventParticipationIds: number[]) => {
    const response = await apiClient.delete(`/admin/event-participations`, {
      data: { eventParticipationIds },
    });
    return response.data;
  },
};
