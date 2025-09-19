import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Modal,
  Radio,
  RadioGroup,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { useQueryClient } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import { QueryKey } from "@/constants/queryKey";
import useCreateRecruitmentRoundMutation from "@/hooks/mutations/useCreateRecruitmentRoundMutation";
import useEditRecruitmentRoundMutation, {
  EditRecruitmentRoundMutationArgumentType,
} from "@/hooks/mutations/useEditRecruitmentRoundMutation";
import {
  FilteredRecruitmentRoundInfoType,
  RecruitmentRoundModalInfoType,
} from "@/types/entities/recruitment";
import { toKSTISOString } from "@/utils/validation/formatDate";

export type RecruitmentRoundInfoModalPropsType = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  editRoundInfo?: FilteredRecruitmentRoundInfoType;
};

export default function RecruitmentRoundInfoModal({
  open,
  onClose,
  isEdit = false,
  editRoundInfo,
}: RecruitmentRoundInfoModalPropsType) {
  const [roundModalInfo, setRoundModalInfo] = useState<RecruitmentRoundModalInfoType>({
    recruitmentRoundId: editRoundInfo?.id ?? 0,
    academicYear: editRoundInfo?.academicYear ?? "",
    semester: editRoundInfo?.semester ?? "",
    roundType: editRoundInfo?.roundType ?? "1차",
    startDate: dayjs(editRoundInfo?.startDate) ?? null,
    endDate: dayjs(editRoundInfo?.endDate) ?? null,
    name: editRoundInfo?.name ?? "",
  });

  const { mutate: editMutate } = useEditRecruitmentRoundMutation();
  const { mutate: createMutate } = useCreateRecruitmentRoundMutation();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!editRoundInfo) {
      return;
    }

    const { id, academicYear, semester, roundType, startDate, endDate, name } = editRoundInfo;

    setRoundModalInfo({
      recruitmentRoundId: id,
      academicYear,
      semester,
      roundType,
      startDate: dayjs(startDate) ?? null,
      endDate: dayjs(endDate) ?? null,
      name,
    });
  }, [editRoundInfo]);

  const handleChangeRoundModalInfo = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setRoundModalInfo(prevModalInfo => ({
      ...prevModalInfo,
      [name]: value,
    }));
  };

  const handleChangeDate = (name: "startDate" | "endDate", newDate: Dayjs | null) => {
    if (!newDate) {
      return;
    }

    const adjustedDate = name === "endDate" ? newDate.endOf("day") : newDate;

    setRoundModalInfo(prevModalInfo => ({
      ...prevModalInfo,
      [name]: adjustedDate,
    }));
  };

  const handleClickSubmit = () => {
    if (!roundModalInfo) {
      return;
    }

    const { name, startDate, endDate, recruitmentRoundId, roundType, academicYear, semester } =
      roundModalInfo;

    const mutationBody: EditRecruitmentRoundMutationArgumentType["body"] = {
      academicYear: Number(academicYear),
      semesterType: semester === "1" ? "FIRST" : "SECOND",
      name,
      startDate: toKSTISOString(startDate!.toDate()),
      endDate: toKSTISOString(endDate!.toDate()),
      roundType: roundType === "1차" ? "FIRST" : roundType === "2차" ? "SECOND" : "THIRD",
    };

    const mutationSuccessHandler = () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.recruitmentRound],
      });
      toast.success(`모집 회차 정보가 ${isEdit ? "수정" : "생성"}되었습니다.`);
      onClose();
    };

    if (!academicYear || !semester || !name || !startDate || !endDate || !roundType) {
      toast.error(`채워지지 않는 필드가 있어요. 모든 필드를 채워주세요!`);
      return;
    }

    if (isEdit) {
      editMutate(
        {
          recruitmentRoundId,
          body: mutationBody,
        },
        {
          onSuccess: mutationSuccessHandler,
        },
      );
      return;
    }

    createMutate(
      {
        body: mutationBody,
      },
      {
        onSuccess: mutationSuccessHandler,
      },
    );
  };

  const { academicYear, semester, roundType, startDate, endDate, name } = roundModalInfo;

  return (
    <Modal open={open} onClose={onClose}>
      <StyledModalContentWrapper>
        <StyledTitle>{isEdit ? "모집 회차 수정" : "모집 회차 생성"}</StyledTitle>
        <StyledContentWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item1" }}>
            <StyledText>활동연도</StyledText>
            <StyledTextField
              isedit={isEdit ? 1 : 0}
              placeholder="연도"
              size="small"
              inputProps={{ readOnly: isEdit }}
              value={academicYear}
              name="academicYear"
              onChange={handleChangeRoundModalInfo}
            />
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item2" }}>
            <StyledText>활동학기</StyledText>
            <StyledTextField
              isedit={isEdit ? 1 : 0}
              placeholder="학기"
              size="small"
              inputProps={{ readOnly: isEdit }}
              value={semester}
              name="semester"
              onChange={handleChangeRoundModalInfo}
            />
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item3" }}>
            <StyledText>차수</StyledText>
            <StyledRadioGroup
              name="roundType"
              row
              value={roundType}
              onChange={handleChangeRoundModalInfo}
            >
              <FormControlLabel value="1차" control={<Radio />} label="1차" />
              <FormControlLabel value="2차" control={<Radio />} label="2차" />
              <FormControlLabel value="3차" control={<Radio />} label="3차" />
            </StyledRadioGroup>
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item4" }}>
            <StyledText>모집 시작일</StyledText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StyledDatePicker
                name="startDate"
                value={startDate}
                onChange={date => handleChangeDate("startDate", date)}
              />
            </LocalizationProvider>
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item5" }}>
            <StyledText>모집 종료일</StyledText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StyledDatePicker
                name="endDate"
                value={endDate}
                onChange={date => handleChangeDate("endDate", date)}
              />
            </LocalizationProvider>
          </StyledInfoWrapper>
          <StyledInfoWrapper sx={{ gridArea: "item6" }}>
            <StyledText>모집 회차 이름</StyledText>
            <StyledTextField
              placeholder="이름"
              size="small"
              value={name}
              name="name"
              onChange={handleChangeRoundModalInfo}
            />
          </StyledInfoWrapper>
        </StyledContentWrapper>
        <StyledButton size="large" variant="contained" onClick={handleClickSubmit}>
          {isEdit ? "수정하기" : "생성하기"}
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
  fontFamily: "SUIT v1",
  fontSize: "32px",
  fontWeight: 700,
  lineHeight: "41.6px",
  letterSpacing: "-0.32px",
});

const StyledButton = styled(Button)({
  padding: "16px 0px",
  width: "328px",
  height: "48px",
});

const StyledContentWrapper = styled(Box)({
  height: "100%",
  width: "100%",
  padding: "10px",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateAreas: `
    "item1 item2 ."
    "item3 . ."
    "item4 item5 ."
    "item6 . ."
  `,
  gap: "10px",
  alignContent: "space-between",
});

const StyledInfoWrapper = styled(Box)<{ height?: number }>(({ height }) => ({
  height: height ? `${height}px` : "71px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  flex: 1,
}));

const StyledTextField = styled(TextField)<{ isedit?: number }>(({ isedit = 0 }) => ({
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

  "input": { color: isedit ? "#C2C2C2" : "#121212" },
}));

const StyledText = styled(Typography)({
  color: "#6B6B6B",
  fontFamily: "SUIT v1",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "14px",
  letterSpacing: "-0.14px",
});

const StyledDatePicker = styled(DatePicker)({
  input: {
    height: "26px",
    padding: "8px 12px",
  },

  width: "297px",
});

const StyledRadioGroup = styled(RadioGroup)({});
