import { EventStatus } from "../entities/event";

// 정렬 관련 타입
interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// 페이지 관련 타입
interface Pageable {
  offset: number;
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
}

// 이벤트 신청 기간 타입
interface ApplicationPeriod {
  startDate: string; // ISO 8601 날짜 문자열
  endDate: string;
}

// 이벤트 생성 요청 타입
export type CreateEventRequest = EventBasicInfoType;

// 이벤트 생성 요청 타입
export type UpdateEventRequest = Omit<EventType, "eventId">;
export type UpdateBasicInfoEventRequest = EventBasicInfoType;
export type UpdateEventFormRequest = EventFormType;
// 이벤트 타입

export interface EventBasicInfoType {
  name: string;
  venue: string;
  startAt: string; // ISO 8601 날짜 문자열
  applicationPeriod: ApplicationPeriod;
  regularRoleOnlyStatus: "ENABLED" | "DISABLED";
  afterPartyMaxApplicantCount: number | null;
  mainEventMaxApplicantCount: number | null;
}

export interface EventFormType {
  applicationDescription: string;
  afterPartyStatus: "ENABLED" | "DISABLED";
  prePaymentStatus: "ENABLED" | "DISABLED";
  postPaymentStatus: "ENABLED" | "DISABLED";
  rsvpQuestionStatus: "ENABLED" | "DISABLED";
  noticeConfirmQuestionStatus: "ENABLED" | "DISABLED";
}
export interface EventType {
  eventId: number;
  name: string;
  venue: string;
  startAt: string; // ISO 8601 날짜 문자열
  applicationDescription: string;
  applicationPeriod: ApplicationPeriod;
  regularRoleOnlyStatus: "ENABLED" | "DISABLED";
  afterPartyStatus: "ENABLED" | "DISABLED";
  prePaymentStatus: "ENABLED" | "DISABLED";
  postPaymentStatus: "ENABLED" | "DISABLED";
  rsvpQuestionStatus: "ENABLED" | "DISABLED";
  noticeConfirmQuestionStatus: "ENABLED" | "DISABLED";
  mainEventMaxApplicantCount: number | null;
  afterPartyMaxApplicantCount: number | null;
}

// content 안에 들어가는 타입
export interface EventContent {
  event: EventType;
  totalAttendeesCount: number;
  eventStatus: EventStatus;
}

// 최상위 API 응답 타입
export interface EventResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: EventContent[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type AfterPartyApplicationStatus = "NONE" | "NOT_APPLIED" | "APPLIED";
export type ParticipantRole = "NON_MEMBER" | "GUEST" | "ASSOCIATE" | "REGULAR";

export interface Participant {
  name: string;
  studentId: string;
  phone: string;
}

export interface ParticipationContent {
  eventParticipationId: number;
  participant: Participant;
  afterPartyApplicationStatus: AfterPartyApplicationStatus;
  participantRole: ParticipantRole;
  discordUsername: string;
  nickname: string;
}

export interface EventParticipantsResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ParticipationContent[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SearchMemberListResponse {
  memberId: number;
  name: string;
  studentId: string;
  participable: boolean;
  phone: string;
}
