import { useQuery } from "@tanstack/react-query";
import { eventApi } from "@/apis/eventApi";
import { QueryKey } from "@/constants/queryKey";

export const useGetSearchMemberListQuery = (
  eventId: number,
  name: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: [QueryKey.searchMemberList, eventId, name],
    queryFn: () => eventApi.getSearchMemberList(eventId, name),
    enabled: enabled && name.trim() !== "",
    staleTime: 1000 * 60, // 1분
  });
};
