import { apiClient } from ".";
import { StudyListApiResponseDto } from "@/types/dtos/study";

export const studyApi = {
  getStudyList: async (): Promise<StudyListApiResponseDto[]> => {
    const response = await apiClient.get("/v2/admin/studies");
    return response.data;
  },
};
