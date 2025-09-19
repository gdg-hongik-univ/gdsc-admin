import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { typography } from "wowds-tokens";
import Button from "wowds-ui/Button";
import { FormField } from "./FormField";
import { FormFieldProps } from "./FormField";
import { Flex } from "../@common/Flex";
import { Space } from "../@common/Space";
import { useCreateEventMutation } from "@/hooks/mutations/useCreateEventMutation";
import { useUpdateEventFormMutation } from "@/hooks/mutations/useUpdateEventFormMutation";
import { EventType, UpdateEventFormRequest } from "@/types/dtos/event";
const getFormFields = (formValue: EventType | null): FormFieldProps[] => {
  return [
    {
      id: "name",
      type: "textfield",
      title: "이름을 입력해주세요",
      value: "예: 홍길동",
    },
    {
      id: "phone",
      type: "textfield",
      title: "전화번호를 입력해주세요",
      value: "예: 010-1234-5678",
    },
    {
      id: "studentId",
      type: "textfield",
      title: "학번을 입력해주세요",
      value: "예: 20241234",
    },
    {
      id: "noticeConfirm",
      type: "option-select",
      title: "유의사항을 확인하셨나요?",
      optional: true,
      optionalChecked: formValue?.noticeConfirmQuestionStatus === "ENABLED",
      options: [{ value: "확인", label: "예, 확인했습니다." }],
    },
    {
      id: "afterParty",
      type: "option-select",
      title: "뒤풀이에 참여하겠습니까?",
      optional: true,
      optionalChecked: formValue?.afterPartyStatus === "ENABLED",
      options: [
        { value: "참여", label: "참여합니다." },
        { value: "불참", label: "참여하지 않겠습니다." },
      ],
    },
    {
      id: "prePayment",
      type: "option-select",
      title: "선입금을 완료하였나요?",
      optional: true,
      optionalChecked: formValue?.prePaymentStatus === "ENABLED", // ENABLED일 때 true
      options: [{ value: "선입금", label: "예, 완료했습니다." }],
    },
    {
      id: "postPayment",
      type: "option-select",
      title: "후정산을 완료하였나요?",
      optional: true,
      optionalChecked: formValue?.postPaymentStatus === "ENABLED", // ENABLED일 때 true
      options: [{ value: "후입금", label: "예, 완료했습니다." }],
    },
    {
      id: "rsvp",
      type: "option-select",
      title: "RSVP 작성을 완료하였나요?",
      optional: true,
      optionalChecked: formValue?.rsvpQuestionStatus === "ENABLED", // ENABLED일 때 true
      options: [{ value: "RSVP 작성", label: "예, 완료했습니다." }],
    },
  ];
};

export const EventForm = ({
  formValue,
  setFormValues,
  eventId,
  totalAttendeesCount,
}: {
  formValue: EventType | null;
  setFormValues: (value: React.SetStateAction<EventType | null>) => void;
  eventId?: number;
  totalAttendeesCount: number;
}) => {
  const [description, setDescription] = useState<string>(formValue?.applicationDescription || "");
  const [formFields, setFormFields] = useState<FormFieldProps[]>(getFormFields(formValue));
  const [requiredById, setRequiredById] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(formFields.map(field => [field.id, true])),
  );

  const createEventMutation = useCreateEventMutation();
  const updateEventFormMutation = useUpdateEventFormMutation();

  const handleRequiredToggle = (id: string, next: boolean) => {
    setRequiredById(prev => ({ ...prev, [id]: next }));

    if (id === "noticeConfirm") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              noticeConfirmQuestionStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }

    // 뒷풀이 질문 토글 시 afterPartyStatus 업데이트
    if (id === "afterParty") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              afterPartyStatus: next ? "ENABLED" : "DISABLED",
              // 뒷풀이가 DISABLED면 선입금도 DISABLED로 설정
              prePaymentStatus: next ? prev.prePaymentStatus : "DISABLED",
              postPaymentStatus: next ? prev.postPaymentStatus : "DISABLED",
              // 뒷풀이가 DISABLED면 뒷풀이 제한 인원도 null로 설정
              afterPartyMaxApplicantCount: next ? prev.afterPartyMaxApplicantCount : null,
            }
          : prev,
      );

      // 뒷풀이가 DISABLED면 선입금/후정산 질문도 비활성화
      if (!next) {
        setRequiredById(prev => ({ ...prev, prePayment: false }));
        setRequiredById(prev => ({ ...prev, postPayment: false }));
      }
    }

    // 선입금 질문 토글 시 prePaymentStatus 업데이트
    if (id === "prePayment") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              prePaymentStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }

    // 후정산 질문 토글 시 postPaymentStatus 업데이트
    if (id === "postPayment") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              postPaymentStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }

    if (id === "rsvp") {
      setFormValues(prev =>
        prev
          ? {
              ...prev,
              rsvpQuestionStatus: next ? "ENABLED" : "DISABLED",
            }
          : prev,
      );
    }
  };

  useEffect(() => {
    if (formValue) {
      setDescription(formValue.applicationDescription);
      const newFormFields = getFormFields(formValue);
      setFormFields(newFormFields);
      // optionalChecked 값에 따라 requiredById 설정
      setRequiredById(
        Object.fromEntries(newFormFields.map(field => [field.id, field.optionalChecked ?? true])),
      );
    } else {
      setDescription("");
      const newFormFields = getFormFields(null);
      setFormFields(newFormFields);
      setRequiredById(Object.fromEntries(newFormFields.map(field => [field.id, true])));
    }
  }, [formValue]);

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };
  const buildEventPayload = (event: EventType): UpdateEventFormRequest => ({
    applicationDescription: event.applicationDescription,
    afterPartyStatus: event.afterPartyStatus,
    prePaymentStatus: event.prePaymentStatus,
    postPaymentStatus: event.postPaymentStatus,
    rsvpQuestionStatus: event.rsvpQuestionStatus,
    noticeConfirmQuestionStatus: event.noticeConfirmQuestionStatus,
  });

  const handlePublish = () => {
    if (!formValue) {
      console.error("formValue가 없습니다.");
      return;
    }

    // 최신 description을 병합하여 페이로드 생성
    setFormValues(prev => (prev ? { ...prev, applicationDescription: description } : prev));
    const nextEvent = { ...formValue, applicationDescription: description };
    const eventPayload = buildEventPayload(nextEvent);

    if (eventId) {
      // 기존 이벤트 수정 - 폼 정보만 업데이트
      updateEventFormMutation.mutate(
        { eventId, eventData: eventPayload },
        {
          onSuccess: () => {
            console.log("이벤트 폼 정보가 성공적으로 수정되었습니다.");
          },
          onError: error => {
            console.error("이벤트 폼 정보 수정 중 오류가 발생했습니다:", error);
          },
        },
      );
    }
  };
  return (
    <div>
      <Space height={16} />
      <Flex justify="end">
        <Button
          size="sm"
          onClick={handlePublish}
          disabled={createEventMutation.isPending || updateEventFormMutation.isPending}
        >
          {createEventMutation.isPending || updateEventFormMutation.isPending
            ? eventId
              ? "수정 중..."
              : "게시 중..."
            : eventId
              ? "수정하기"
              : "게시하기"}
        </Button>
      </Flex>
      <Space height={30} />
      <textarea
        placeholder="행사 신청 폼 설명을 입력해주세요"
        value={description}
        onChange={e => handleDescriptionChange(e.target.value)}
        css={css({
          "width": "100%",
          "height": "100px",
          "padding": "12px",
          "border": "1px solid #ccc",
          "borderRadius": "4px",
          ...typography.body1,
          "fontFamily": "inherit",
          "resize": "vertical",
          "&:focus": {
            outline: "none",
            borderColor: "#1976d2",
            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
          },
        })}
      />
      <Space height={32} />
      <Flex gap="sm" direction="column">
        {formFields.map(field => (
          <FormField
            key={field.id}
            {...field}
            optionalChecked={field.optionalChecked ?? requiredById[field.id]}
            onOptionalChange={checked => handleRequiredToggle(field.id, checked)}
            isDisabled={
              //NOTE: 신청 인원이 한 명이라도 생긴 경우 뒷풀이, 선입금, 후정산 질문은 비활성화
              eventId &&
              totalAttendeesCount > 0 &&
              (field.id === "noticeConfirm" ||
                field.id === "afterParty" ||
                field.id === "prePayment" ||
                field.id === "postPayment" ||
                field.id === "rsvp")
                ? true
                : false
            }
          />
        ))}
      </Flex>
    </div>
  );
};
