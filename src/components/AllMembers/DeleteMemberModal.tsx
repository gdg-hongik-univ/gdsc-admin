import styled from "@emotion/styled";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

type DeleteMemberModalProps = {
  open: boolean;
  memberName?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteMemberModal({
  open,
  memberName,
  onClose,
  onConfirm,
}: DeleteMemberModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>회원 탈퇴 처리</DialogTitle>

      <DialogContent>
        <Typography>정말 {memberName} 회원을 탈퇴 처리하시겠습니까?</Typography>
      </DialogContent>

      <DialogActions>
        <StyledButton variant="outlined" color="primary" onClick={onClose}>
          취소
        </StyledButton>
        <StyledButton variant="outlined" color="error" onClick={onConfirm}>
          탈퇴
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
}

const StyledButton = styled(Button)({
  padding: "8px 22px",
  height: "32px",
});
