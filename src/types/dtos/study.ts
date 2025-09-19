import type { DayOfWeekType } from "../entities/dayofWeek";
import type { PeriodType } from "../entities/period";
import type { StudySemesterType, StudyType } from "types/entities/study";
import type { TimeType } from "types/entities/time";

export interface StudyListApiResponseDto {
  study: StudyApiResponseV2Dto;
  studySessions: StudySessionApiResponseV2Dto[];
}

export interface StudyApiResponseV2Dto {
  studyId: number;
  type: StudyType;
  title: string;
  descriptionNotionLink: string;
  description: string;
  semester: {
    academicYear: number;
    semesterType: StudySemesterType;
  };
  totalRound: number;
  dayOfWeek: DayOfWeekType;
  startTime: TimeType;
  endTime: TimeType;
  applicationPeriod: {
    startDate: string;
    endDate: string;
  };
  discordChannelId: string;
  discordRoleId: string;
  mentorId: number;
  mentorName: string;
  minAssignmentLength?: number;
}

export interface StudySessionApiResponseV2Dto {
  studySessionId: number;
  position: number;
  lessonTitle: string;
  description: string;
  lessonAttendanceNumber: string;
  lessonPeriod: PeriodType;
  assignmentTitle?: string;
  assignmentDescriptionLink: string;
  assignmentPeriod: PeriodType;
  studyId: number;
}
