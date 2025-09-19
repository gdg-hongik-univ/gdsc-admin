import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { color } from "wowds-tokens";
import Button from "wowds-ui/Button";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";
import Pagination from "wowds-ui/Pagination";
import SearchBar from "wowds-ui/SearchBar";
import Table from "wowds-ui/Table";
import { Flex } from "../@common/Flex";
import { Space } from "../@common/Space";
import { AddMemberModal } from "./Modal/AddMemberModal";
import { DeleteMemberModal } from "./Modal/DeleteMemberModal";
import { Text } from "../@common/Text";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useGetEventParticipants } from "@/hooks/queries/useGetAllParticipants";
import {
  AfterPartyApplicationStatus,
  ParticipantRole,
  ParticipationContent,
} from "@/types/dtos/event";
import { isDigitStart, onlyDigits, isEnglishStart, isKoreanStart } from "@/utils/searchQuery";

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

export const ApplyMember = ({ title }: { title: string }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const id = Number(eventId);

  const [sortKey, setSortKey] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  const { data } = useGetEventParticipants(id, currentPage, pageSize, sortKey);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const handleSelectionChange = useCallback((rows: number[]) => setSelectedRows(rows), []);

  const participants = useMemo(() => data?.content || [], [data]);
  const showAfterParty = participants.some(
    (d: ParticipationContent) => d.afterPartyApplicationStatus !== "NONE",
  );

  const [searchedValue, setSearchedValue] = useState("");
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [deleteMemberOpen, setDeleteMemberOpen] = useState(false);

  const debouncedQuery = useDebounce(searchedValue, 300); // 300ms 디바운스
  const filtered = useMemo(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      return participants;
    }

    if (isDigitStart(q)) {
      // 전화번호: 숫자만 비교
      const qDigits = onlyDigits(q);
      return participants.filter((row: ParticipationContent) =>
        onlyDigits(row.participant.phone)?.includes(qDigits),
      );
    }

    if (isEnglishStart(q)) {
      // 학번(studentId): 대소문자 무시 포함 검색
      const qLower = q.toLowerCase();
      return participants.filter((row: ParticipationContent) =>
        row.participant.studentId?.toLowerCase()?.includes(qLower),
      );
    }

    if (isKoreanStart(q)) {
      // 이름: 포함 검색
      return participants.filter((row: ParticipationContent) => row.participant.name?.includes(q));
    }

    // 기타 문자는 전체 반환(원하면 여기서 추가 규칙 가능)
    return participants;
  }, [participants, debouncedQuery]);

  // 선택된 참가자들 가져오기
  const selectedParticipants = useMemo(() => {
    return participants.filter(p => selectedRows.includes(p.eventParticipationId));
  }, [participants, selectedRows]);

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    if (selectedRows.length === 0) {
      alert("삭제할 참가자를 선택해주세요.");
      return;
    }
    setDeleteMemberOpen(true);
  };

  // 페이지 변경 핸들러
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page - 1); // Pagination은 1부터 시작하지만 API는 0부터 시작
    setSelectedRows([]); // 페이지 변경 시 선택된 행들 초기화
  }, []);

  // 삭제 성공 핸들러
  const handleDeleteSuccess = useCallback(() => {
    setSelectedRows([]);
  }, []);

  return (
    <div>
      <Space height={30} />
      <Flex justify="space-between">
        <Text typo="h2">
          행사 신청 인원{" "}
          <Text as="span" color="primary" typo="h2">
            {participants.length}명
          </Text>
        </Text>

        <Flex gap="sm" justify="end">
          <Button variant="outline" onClick={() => setAddMemberOpen(true)} size="sm">
            인원 추가
          </Button>
          <Button variant="outline" onClick={handleDeleteClick} size="sm">
            인원 삭제
          </Button>
        </Flex>
      </Flex>
      <Space height={30} />
      <AddMemberModal open={addMemberOpen} setOpen={setAddMemberOpen} title={title} />
      <DeleteMemberModal
        open={deleteMemberOpen}
        setOpen={setDeleteMemberOpen}
        selectedParticipants={selectedParticipants}
        onDeleteSuccess={handleDeleteSuccess}
      />
      <Flex gap="sm">
        <SearchBar
          placeholder="이름,학번,학과,전화번호로 검색"
          style={{ flex: 1 }}
          value={searchedValue}
          onChange={setSearchedValue}
        />
        <DropDown
          placeholder="정렬"
          style={{ flex: "auto" }}
          value={sortKey}
          onChange={({ selectedValue }) => setSortKey(selectedValue)}
        >
          <DropDownOption value="createdAt" text="최신순" />
          <DropDownOption value="name" text="이름순" />
        </DropDown>
      </Flex>

      <Space height={30} />
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
          {filtered.map(
            ({
              participant,
              afterPartyApplicationStatus,
              participantRole,
              discordUsername,
              nickname,
              eventParticipationId,
            }: ParticipationContent) => {
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

      <Space height={30} />

      {/* Pagination */}
      <Flex justify="center">
        <Pagination
          onChange={handlePageChange}
          totalPages={data?.totalPages || 1}
          currentPage={currentPage + 1} // Pagination은 1부터 시작
        />
      </Flex>
    </div>
  );
};
