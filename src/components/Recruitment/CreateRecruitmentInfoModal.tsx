import WarningIcon from "@/assets/warning.svg?react";
import { QueryKey } from "@/constants/queryKey";
import useCreateRecruitmentMutation from "@/hooks/mutations/useCreateRecruitmentMutation";
import { RecruitmentModalInfoType } from "@/types/entities/recruitment";
import { toKSTISOString } from "@/utils/validation/formatDate";
import styled from "@emotion/styled";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { useQueryClient } from "@tanstack/react-query";
import { Dayjs } from "dayjs";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";

type CreateRecruitmentInfoModalPropsType = {
  open: boolean;
  onClose: () => void;
};

export default function CreateRecruitmentInfoModal({
  open,
  onClose,
}: CreateRecruitmentInfoModalPropsType) {
  const [recruitmentModalInfo, setRecruitmentModalInfo] = useState<RecruitmentModalInfoType>({
    semesterStartDate: null,
    semesterEndDate: null,
    academicYear: "",
    semester: "",
    fee: "",
    feeName: "",
  });

  const { mutate } = useCreateRecruitmentMutation();

  const queryClient = useQueryClient();

  const { semesterStartDate, semesterEndDate, academicYear, semester, fee, feeName } =
    recruitmentModalInfo;

  const handleChangeRecruitmentModalInfo = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setRecruitmentModalInfo(prevModalInfo => ({
      ...prevModalInfo,
      [name]: value,
    }));
  };

  const handleChangeDate = (
    name: "semesterStartDate" | "semesterEndDate",
    newDate: Dayjs | null,
  ) => {
    if (!newDate) {
      return;
    }

    setRecruitmentModalInfo(prevModalInfo => ({
      ...prevModalInfo,
      [name]: newDate,
    }));
  };

  const handleClickCreateRecruitment = () => {
    if (!semesterStartDate || !semesterEndDate || !academicYear || !fee || !semester || !feeName) {
      toast.error(`채워지지 않는 필드가 있어요. 모든 필드를 채워주세요!`);
      return;
    }

    mutate(
      {
        semesterStartDate: toKSTISOString(semesterStartDate.toDate()),
        semesterEndDate: toKSTISOString(semesterEndDate.endOf("day").toDate()),
        academicYear,
        semesterType: semester === "1" ? "FIRST" : "SECOND",
        fee,
        feeName,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKey.recruitment],
          });
          toast.success("리크루팅이 생성되었습니다.");
          onClose();
        },
      },
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalContentWrapper>
        <StyledTitle>학기 정보 생성</StyledTitle>
        <StyledContentWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item1" }}>
            <StyledText>활동연도</StyledText>
            <StyledTextField
              placeholder="연도"
              size="small"
              value={academicYear}
              name="academicYear"
              onChange={handleChangeRecruitmentModalInfo}
            />
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item2" }}>
            <StyledText>활동학기</StyledText>
            <StyledTextField
              placeholder="학기"
              size="small"
              value={semester}
              name="semester"
              onChange={handleChangeRecruitmentModalInfo}
            />
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item3" }}>
            <StyledText>회비</StyledText>
            <StyledTextField
              placeholder="회비"
              size="small"
              value={fee}
              name="fee"
              onChange={handleChangeRecruitmentModalInfo}
            />
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item4" }}>
            <StyledText>회비 이름</StyledText>
            <StyledTextField
              placeholder="이름"
              size="small"
              value={feeName}
              name="feeName"
              onChange={handleChangeRecruitmentModalInfo}
            />
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item5" }}>
            <StyledText>학기 시작일</StyledText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StyledDatePicker
                name="semesterStartDate"
                value={semesterStartDate}
                onChange={date => handleChangeDate("semesterStartDate", date)}
              />
            </LocalizationProvider>
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item6" }}>
            <StyledText>학기 종료일</StyledText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StyledDatePicker
                name="semesterEndDate"
                value={semesterEndDate}
                onChange={date => handleChangeDate("semesterEndDate", date)}
              />
            </LocalizationProvider>
          </StyledInfoWrapper>
        </StyledContentWrapper>
        <StyledWarningTextWrapper>
          <WarningIcon />
          <StyledWarningText color="error">
            1차 신청기간 시작 전에 수동으로 [일괄 강등하기] 버튼을 눌러야 해요. <br />
            학기 정보는 당일에는 생성할 수 없어요. 미리 생성 부탁드려요.
          </StyledWarningText>
        </StyledWarningTextWrapper>
        <StyledButton size="large" variant="contained" onClick={handleClickCreateRecruitment}>
          {"생성하기"}
        </StyledButton>
      </StyledModalContentWrapper>
    </Modal>
  );
}

const StyledModalContentWrapper = styled("main")({
  width: "988px",
  height: "640px",
  backgroundColor: "white",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  padding: "40px",
});

const StyledTitle = styled(Typography)({
  fontFamily: "SUIT",
  fontSize: "32px",
  fontWeight: 700,
  lineHeight: "41.6px",
  letterSpacing: "-0.32px",
});

const StyledInfoWrapper = styled(Box)<{ height?: number }>(({ height }) => ({
  height: height ? `${height}px` : "71px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  flex: 1,
}));

const StyledTextField = styled(TextField)({
  "width": "100%",

  ".MuiInputBase-root": {
    borderRadius: 4,
    border: "1px solid #C2C2C2",
    padding: "8px 14px",
    height: "40px",
  },

  ".MuiInputBase-input": {
    padding: 0,
    fontFamily: "Pretendard",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "22.4px",
  },

  "fieldset": {
    border: "none",
  },

  ".MuiInputBase-input::placeholder": {
    color: "#C2C2C2",
  },
});

const StyledText = styled(Typography)({
  color: "#6B6B6B",
  fontFamily: "SUIT",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "14px",
  letterSpacing: "-0.14px",
});

const StyledButton = styled(Button)({
  padding: "16px 0px",
  width: "328px",
  height: "48px",
});

const StyledWarningTextWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const StyledWarningText = styled(Typography)({});

const StyledContentWrapper = styled(Box)({
  height: "100%",
  width: "100%",
  padding: "10px",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateAreas: `
    "item1 item2 ."
    "item3 item4 ."
    "item5 item6 ."
  `,
  gap: "10px",
  alignContent: "space-between",
});

const StyledDatePicker = styled(DatePicker)({
  input: {
    height: "26px",
    padding: "8px 12px",
  },

  width: "297px",
});
