import { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "wowds-ui/Button";
import TextField from "wowds-ui/TextField";
import { Text } from "@/components/@common/Text";
import usePostMemberParticipantsMutation from "@/hooks/mutations/usePostMemberParticipants";

export const NoneMemberParticipate = ({
  name: selectedName,
  handleBack,
}: {
  name: string;
  handleBack: () => void;
}) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");

  // eventId를 숫자로 변환
  const eventIdNumber = eventId ? parseInt(eventId, 10) : 0;

  const postNoneMemberParticipantsMutation = usePostMemberParticipantsMutation();

  const handleSubmit = async () => {
    if (studentId.trim() === "" || phone.trim() === "") {
      alert("학번, 이름, 전화번호를 모두 입력해주세요.");
      return;
    }

    try {
      await postNoneMemberParticipantsMutation.mutateAsync({
        eventId: eventIdNumber,
        participant: {
          name: selectedName,
          studentId: studentId.trim(),
          phone: phone.trim(),
        },
      });

      // 성공 시 입력값 초기화
      setStudentId("");
      setPhone("");
      alert("비회원 참가자가 성공적으로 등록되었습니다.");
    } catch (error) {
      console.error("비회원 참가자 등록 중 오류 발생:", error);
      alert("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleReset = () => {
    handleBack();
    setStudentId("");
    setPhone("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
      <Text typo="h1">
        {selectedName} 이름의 학생이 어드민에 없어요. <br />
        신청 명단에 새로 추가하시겠어요?
      </Text>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <TextField placeholder="C123456" label="학번" value={studentId} onChange={setStudentId} />

        <TextField placeholder="010-1234-5678" label="전화번호" value={phone} onChange={setPhone} />
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <Button variant="outline" onClick={handleReset}>
          뒤로가기
        </Button>
        <Button
          disabled={
            studentId.trim() === "" ||
            phone.trim() === "" ||
            postNoneMemberParticipantsMutation.isPending
          }
          onClick={handleSubmit}
        >
          {postNoneMemberParticipantsMutation.isPending ? "등록 중..." : "등록하기"}
        </Button>
      </div>
    </div>
  );
};
