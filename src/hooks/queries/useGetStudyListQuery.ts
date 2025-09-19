import { useQuery } from "@tanstack/react-query";
import { studyApi } from "@/apis/studyListApi";
import { QueryKey } from "@/constants/queryKey";

export default function useGetStudyListQuery() {
  const { data = [] } = useQuery({
    queryKey: [QueryKey.studyList],
    queryFn: () => studyApi.getStudyList(),
  });

  return data
    .map(study => ({
      studyId: study.study.studyId,
      title: study.study.title,
      startDate: new Date(study.study.applicationPeriod.startDate),
    }))
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}
