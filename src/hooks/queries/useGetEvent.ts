import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

export const useGetEvent = (eventId: number | null) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) {
        return null;
      }

      // 전체 이벤트 목록에서 특정 이벤트 찾기
      const eventListResponse = await eventApi.getEventList(0, 20);
      const event = eventListResponse.content.find(c => c.event.eventId === eventId);
      return {
        eventData: event?.event || null,
        totalAttendeesCount: event?.totalAttendeesCount,
      };
    },
    enabled: eventId !== null && eventId > 0,
  });
};
