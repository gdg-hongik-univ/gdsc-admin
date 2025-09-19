import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { useParams } from "react-router-dom";
import { color } from "wowds-tokens";
import Box from "wowds-ui/Box";
import Button from "wowds-ui/Button";
import Checkbox from "wowds-ui/Checkbox";
import TextField from "wowds-ui/TextField";
import { NoneMemberParticipate } from "./NoneMemberParticipate";
import { Space } from "@/components/@common/Space";
import { Text } from "@/components/@common/Text";
import usePostNoneMemberParticipantsMutation from "@/hooks/mutations/usePostMemberParticipants";
import { useGetSearchMemberListQuery } from "@/hooks/queries/useGetSearchMemberListQuery";
import { SearchMemberListResponse } from "@/types/dtos/event";

type Phase = "INPUT" | "MEMBER_SEARCH" | "PICK" | "NONE_MEMBER_SEARCH";

export const AddMemberModal = ({
  title,
  open,
  setOpen,
}: {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("INPUT");
  const [searchResults, setSearchResults] = useState<SearchMemberListResponse[]>([]);
  const [searchTrigger, setSearchTrigger] = useState(false); // 검색 트리거
  const [selectedMember, setSelectedMember] = useState<SearchMemberListResponse | undefined>(
    undefined,
  );

  // eventId를 숫자로 변환
  const eventIdNumber = eventId ? parseInt(eventId, 10) : 0;

  const { data: searchResponse, isLoading } = useGetSearchMemberListQuery(
    eventIdNumber,
    name,
    searchTrigger,
  );

  const postParticipantsMutation = usePostNoneMemberParticipantsMutation();
  // API 응답이 변경될 때마다 searchResults 상태 업데이트
  useEffect(() => {
    if (searchResponse) {
      setSearchResults(searchResponse);
    }
  }, [searchResponse]);

  const handle1PhaseButtonClick = () => {
    if (name.trim() === "") {
      return;
    }
    // 검색 트리거를 증가시켜서 API 호출
    setSearchTrigger(true);
  };

  const handleAddMember = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      await postParticipantsMutation.mutateAsync({
        eventId: eventIdNumber,
        participant: {
          name: selectedMember.name,
          studentId: selectedMember.studentId.trim(),
          phone: selectedMember.phone.trim(),
        },
      });
      // 상태 초기화
      setPhase("PICK");
      setSearchTrigger(false);
      setSearchResults([]);
      setName("");
    } catch (error) {
      console.error("멤버 추가 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    if (searchTrigger && !isLoading && searchResponse) {
      const participableStudents = searchResults.filter(student => student.participable === true);
      if (participableStudents.length > 0) {
        setPhase("MEMBER_SEARCH");
      } else {
        setPhase("NONE_MEMBER_SEARCH");
      }
    }
  }, [searchTrigger, isLoading, searchResponse, searchResults]);
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Box
        text={
          <>
            <Text typo="body1" color="sub">
              {title}
            </Text>
            {phase === "INPUT" && (
              <>
                <Text as="h1" typo="h1">
                  신청 인원 명단에 추가할 학생의 이름을 입력해주세요
                </Text>
                <Space height={76} />
                <TextField placeholder="김홍익" label="" value={name} onChange={setName} />
                <Space height={121} />
                <Button
                  disabled={name === "" || isLoading}
                  onClick={handle1PhaseButtonClick}
                  style={{ width: "100% !important" }}
                >
                  {isLoading ? "검색 중..." : "다음으로"}
                </Button>
              </>
            )}

            {phase === "MEMBER_SEARCH" && (
              <>
                <Text as="h1" typo="h1">
                  아래의 학생이 맞는지 확인해주세요
                </Text>
                <Space height={76} />
                {searchResults &&
                  searchResults.length > 0 &&
                  searchResults.filter(student => student.participable === true).length > 0 &&
                  searchResults
                    .filter(student => student.participable === true)
                    .map((student, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          border: "1px solid black",
                          borderRadius: "10px",
                          padding: "10px",
                        }}
                      >
                        <Text typo="h3">{student.name}</Text>
                        <Text typo="body1" color="sub">
                          {student.studentId}
                        </Text>
                        <Checkbox
                          checked={selectedMember?.memberId === student.memberId}
                          onChange={() => setSelectedMember(student)}
                        />
                      </div>
                    ))}
                <Space height={76} />
                <div style={{ display: "flex", gap: "20px" }}>
                  <Button
                    onClick={() => {
                      setPhase("INPUT");
                      setSearchTrigger(false);
                      setSearchResults([]);
                      setSelectedMember(undefined);
                      setName("");
                    }}
                  >
                    다시 검색
                  </Button>
                  <Button
                    disabled={!selectedMember || postParticipantsMutation.isPending}
                    onClick={handleAddMember}
                  >
                    {postParticipantsMutation.isPending ? "추가 중..." : "추가하기"}
                  </Button>
                </div>
              </>
            )}
            {phase === "PICK" && (
              <div>
                {selectedMember && (
                  <div>
                    <Text typo="h1" as="h1">
                      <span style={{ color: color.primary }}> {selectedMember.name}</span> 님을 행사
                      신청 인원에 추가했어요.
                    </Text>
                  </div>
                )}
              </div>
            )}
            {phase === "NONE_MEMBER_SEARCH" && (
              <>
                <NoneMemberParticipate
                  name={name}
                  handleBack={() => {
                    setPhase("INPUT");
                    setSearchTrigger(false);
                    setSearchResults([]);
                    setSelectedMember(undefined);
                    setName("");
                  }}
                />
              </>
            )}
          </>
        }
        style={{
          position: "absolute",
          bottom: "50%",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          height: "450px",
          width: "652px",
        }}
      />
    </Modal>
  );
};
