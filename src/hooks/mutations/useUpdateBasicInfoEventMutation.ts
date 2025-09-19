import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";
import { UpdateBasicInfoEventRequest } from "@/types/dtos/event";

export const useUpdateBasicInfoEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { eventId: number; eventData: UpdateBasicInfoEventRequest }>({
    mutationFn: ({ eventId, eventData }) => eventApi.updateBasicInfoEvent(eventId, eventData),
    onSuccess: (data, variables) => {
      // 이벤트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [QueryKey.eventList] });
      // 특정 이벤트 캐시 업데이트
      queryClient.setQueryData([QueryKey.eventList, variables.eventId], data);
    },
    onError: error => {
      console.error("이벤트 기본 정보 수정 중 오류가 발생했습니다:", error);
    },
  });
};
