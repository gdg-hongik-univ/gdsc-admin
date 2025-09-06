// hooks/queries/useGetEventParticipants.ts
import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { EventParticipantsResponse } from "@/types/dtos/event";

export const useGetEventParticipants = (eventId: number, page: number = 0, size: number = 20) => {
  return useQuery<EventParticipantsResponse>({
    queryKey: ["eventParticipants"],
    queryFn: () => eventApi.getParticipants(eventId, page, size),
    staleTime: 60_000,
  });
};
