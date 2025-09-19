import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";

interface DeleteEventParticipantsRequest {
  eventId: number;
  eventParticipationIds: number[];
}

export const useDeleteEventParticipants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventParticipationIds }: DeleteEventParticipantsRequest) =>
      eventApi.deleteParticipants(eventParticipationIds),
    onSuccess: (_, { eventId }) => {
      // 이벤트 참가자 목록 쿼리 무효화하여 새로고침
      queryClient.invalidateQueries({
        queryKey: ["eventParticipants", eventId],
      });
    },
  });
};
