import { useState } from "react";
import { css } from "@emotion/react";
import { color } from "wowds-tokens";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";
import SearchBar from "wowds-ui/SearchBar";
import Table from "wowds-ui/Table";
import { Flex } from "../@common/Flex";
import { useGetEventParticipants } from "@/hooks/queries/useGetAllParticipants";
import {
  AfterPartyApplicationStatus,
  EventParticipantsResponse,
  ParticipantRole,
} from "@/types/dtos/event";

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

export function toParticipantRoleLabel(role: ParticipantRole): string {
  switch (role) {
    case "NON_MEMBER":
      return "비회원";
    case "GUEST":
      return "게스트";
    case "ASSOCIATE":
      return "준회원";
    case "REGULAR":
      return "정회원";
    default:
      return "-";
  }
}

export function toAfterPartyStatusLabel(status: AfterPartyApplicationStatus): string {
  switch (status) {
    case "NONE":
      return "해당 없음";
    case "NOT_APPLIED":
      return "X";
    case "APPLIED":
      return "O";
    default:
      return "-";
  }
}

export const ApplyMember = () => {
  //const { data: appliedStudent } = useGetEventParticipants(1, 0, 20);
  const data = mockEventParticipantsResponse.content;
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const handleSelectionChange = (rows: number[]) => setSelectedRows(rows);

  const showAfterParty = data.some(d => d.afterPartyApplicationStatus !== "NONE");

  return (
    <div>
      <Flex gap="sm">
        <SearchBar placeholder="이름,학번,학과,전화번호로 검색" style={{ flex: 1 }} />
        <DropDown placeholder="정렬" style={{ flex: "auto" }}>
          <DropDownOption value="recent" text="최신순" />
          <DropDownOption value="name" text="이름순" />
        </DropDown>
      </Flex>

      <Table
        selectedRowsProp={selectedRows}
        showCheckbox
        onChange={handleSelectionChange}
        fullWidth
      >
        <Table.Thead>
          <Table.Th>이름</Table.Th>
          <Table.Th>학번</Table.Th>
          <Table.Th>전화번호</Table.Th>
          {showAfterParty && <Table.Th>뒤풀이 신청</Table.Th>}
          <Table.Th>회원 유형</Table.Th>
          <Table.Th>디코 사용자명</Table.Th>
          <Table.Th>디코 닉네임</Table.Th>
        </Table.Thead>

        <Table.Tbody style={{ width: "100%" }}>
          {data.map(
            ({
              participant,
              afterPartyApplicationStatus,
              participantRole,
              discordUsername,
              nickname,
              eventParticipationId,
            }) => {
              const isNonRegular = participantRole !== "REGULAR";

              // ✅ 공통 셀 스타일 생성기: 필요 시 추가 스타일을 합쳐서 사용
              const cellStyle = (extra?: React.CSSProperties) => ({
                ...(isNonRegular ? { backgroundColor: "#FFF0F0" } : {}),
                ...(extra ?? {}),
              });

              return (
                <Table.Tr key={eventParticipationId} value={Number(eventParticipationId)}>
                  <Table.Td style={cellStyle()}>{participant.name}</Table.Td>
                  <Table.Td style={cellStyle()}>{participant.studentId}</Table.Td>
                  <Table.Td style={cellStyle()}>{participant.phone}</Table.Td>

                  {showAfterParty && (
                    <Table.Td style={cellStyle()}>
                      {toAfterPartyStatusLabel(afterPartyApplicationStatus)}
                    </Table.Td>
                  )}

                  {/* 회원 유형: 비정회원이면 텍스트 빨강 */}
                  <Table.Td style={cellStyle(isNonRegular ? { color: color.error } : undefined)}>
                    {toParticipantRoleLabel(participantRole)}
                  </Table.Td>

                  {/* 서브톤 텍스트 두 칸 */}
                  <Table.Td style={cellStyle({ color: color.sub })}>{discordUsername}</Table.Td>
                  <Table.Td style={cellStyle({ color: color.sub })}>{nickname}</Table.Td>
                </Table.Tr>
              );
            },
          )}
        </Table.Tbody>
      </Table>
    </div>
  );
};
