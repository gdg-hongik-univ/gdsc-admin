// hooks/useEventList.ts
import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { EventResponse } from "@/types/dtos/event";

export const useEventList = (page: number = 1, size: number = 20) => {
  return useQuery<EventResponse>({
    queryKey: ["eventList"],
    queryFn: () => eventApi.getEventList(page, size),
    staleTime: 1000 * 600,
  });
};
