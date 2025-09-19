import { EventParticipantsResponse } from "@/types/dtos/event";

export const mockEventParticipantsResponse: EventParticipantsResponse = {
  totalElements: 3,
  totalPages: 1,
  size: 20,
  number: 0,
  sort: { empty: false, sorted: true, unsorted: false },
  numberOfElements: 3,
  pageable: {
    offset: 0,
    sort: { empty: false, sorted: true, unsorted: false },
    pageNumber: 0,
    pageSize: 20,
    unpaged: false,
    paged: true,
  },
  first: true,
  last: true,
  empty: false,
  content: [
    {
      eventParticipationId: 101,
      participant: { name: "김유진", studentId: "C035087", phone: "010-1234-5678" },
      afterPartyApplicationStatus: "NOT_APPLIED",
      participantRole: "NON_MEMBER",
      discordUsername: "yujin#0420",
      nickname: "유진유진",
    },
    {
      eventParticipationId: 102,
      participant: { name: "강해린", studentId: "C011111", phone: "010-0000-0000" },
      afterPartyApplicationStatus: "NOT_APPLIED",
      participantRole: "NON_MEMBER",
      discordUsername: "haerin#7777",
      nickname: "해맑",
    },
    {
      eventParticipationId: 103,
      participant: { name: "김민지", studentId: "C234567", phone: "010-2222-3333" },
      afterPartyApplicationStatus: "NOT_APPLIED",
      participantRole: "REGULAR",
      discordUsername: "minji#9999",
      nickname: "민지짱",
    },
  ],
};
