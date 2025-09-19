import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";
import { CreateEventRequest, EventType } from "@/types/dtos/event";

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<EventType, Error, CreateEventRequest>({
    mutationFn: (eventData: CreateEventRequest) => eventApi.createEvent(eventData),
    onSuccess: data => {
      // 이벤트 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: [QueryKey.eventList] });

      console.log("이벤트가 성공적으로 생성되었습니다:", data);
    },
    onError: error => {
      console.error("이벤트 생성 중 오류가 발생했습니다:", error);
    },
  });
};
