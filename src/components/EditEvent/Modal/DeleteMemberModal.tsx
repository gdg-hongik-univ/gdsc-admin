import { css } from "@emotion/react";
import { Modal } from "@mui/material";
import { useParams } from "react-router-dom";
import Box from "wowds-ui/Box";
import Button from "wowds-ui/Button";
import { Flex } from "@/components/@common/Flex";
import { Space } from "@/components/@common/Space";
import { Text } from "@/components/@common/Text";
import { useDeleteEventParticipants } from "@/hooks/mutations/useDeleteEventParticipants";
import { ParticipationContent } from "@/types/dtos/event";

interface DeleteMemberModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedParticipants: ParticipationContent[];
  onDeleteSuccess?: () => void;
}

export const DeleteMemberModal = ({
  open,
  setOpen,
  selectedParticipants,
  onDeleteSuccess,
}: DeleteMemberModalProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const id = Number(eventId);

  // 삭제 핸들러
  const deleteParticipantsMutation = useDeleteEventParticipants();

  const handleDelete = async () => {
    if (selectedParticipants.length > 0) {
      try {
        const eventParticipationIds = selectedParticipants.map(p => p.eventParticipationId);
        await deleteParticipantsMutation.mutateAsync({ eventId: id, eventParticipationIds });
        setOpen(false);
        onDeleteSuccess?.();
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다:");
        // 에러 처리 로직 추가 가능 (예: 토스트 메시지 표시)
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        text={
          <div style={{ height: "100%" }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: "24px" }}>
              <Text typo="h2" color="primary">
                행사 신청 인원 삭제
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                css={css({
                  padding: "4px",
                  minWidth: "auto",
                })}
              >
                ✕
              </Button>
            </Flex>

            {/* Content */}
            <div>
              <Text typo="h2" style={{ marginBottom: "16px" }} as="h2">
                아래의{" "}
                <Text as="span" color="primary" typo="h2">
                  {selectedParticipants.length}명을
                </Text>
                <br />
                행사 신청 인원에서 삭제하시겠어요?
              </Text>

              {/* Selected Participants List */}
              <div
                css={css({
                  overflowY: "auto",
                  borderRadius: "4px",
                  padding: "12px",
                })}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      selectedParticipants.length > 1 ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
                    gap: "12px",
                  }}
                >
                  {selectedParticipants.map((participant, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        border: "1px solid #c2c2c2",
                        borderRadius: "8px",
                        padding: "24px",
                      }}
                    >
                      <Text typo="h3">{participant.participant.name}</Text>
                      <Text typo="body1" color="sub">
                        {participant.participant.studentId}
                      </Text>
                    </div>
                  ))}
                </div>
                <Space height={121} />
              </div>
            </div>

            {/* Actions */}
            <Flex gap="sm" justify="end">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={deleteParticipantsMutation.isPending}
              >
                취소하기
              </Button>
              <Button
                onClick={handleDelete}
                disabled={selectedParticipants.length === 0 || deleteParticipantsMutation.isPending}
                style={{
                  backgroundColor: selectedParticipants.length === 0 ? "#ccc" : undefined,
                  cursor: selectedParticipants.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                {deleteParticipantsMutation.isPending ? "삭제 중..." : `삭제하기`}
              </Button>
            </Flex>
          </div>
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
