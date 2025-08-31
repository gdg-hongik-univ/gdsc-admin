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

// 이벤트 타입
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
  mainEventMaxApplicantCount: number;
  afterPartyMaxApplicantCount: number;
}

// content 안에 들어가는 타입
interface EventContent {
  event: EventType;
  totalAttendeesCount: number;
  eventStatus: "BEFORE_APPLICATION" | "APPLICATION_OPEN" | "APPLICATION_CLOSED" | "EVENT_ENDED";
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
