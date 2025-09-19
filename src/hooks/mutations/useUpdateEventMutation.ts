import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";
import RoutePath from "@/routes/routePath";
import { EventType, UpdateEventRequest } from "@/types/dtos/event";

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<EventType, Error, { eventId: number; eventData: UpdateEventRequest }>({
    mutationFn: ({ eventId, eventData }) => eventApi.updateEvent(eventId, eventData),
    onSuccess: (data, variables) => {
      // 이벤트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [QueryKey.eventList] });
      // 특정 이벤트 캐시 업데이트
      queryClient.setQueryData([QueryKey.eventList, variables.eventId], data);
      navigate(RoutePath.EventsHomePage);
    },
    onError: error => {
      console.error("이벤트 수정 중 오류가 발생했습니다:", error);
    },
  });
};
