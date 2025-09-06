import { useState } from "react";
import { css } from "@emotion/react";
import Button from "wowds-ui/Button";
import TextField from "wowds-ui/TextField";
import { FormField } from "./FormField";
import { FormFieldProps } from "./FormField";
import { Flex } from "../@common/Flex";
import { Space } from "../@common/Space";

const formFields: FormFieldProps[] = [
  {
    type: "textfield",
    title: "이름을 입력해주세요",
    value: "예: 홍길동",
  },

  {
    type: "textfield",
    title: "전화번호를 입력해주세요",
    value: "예: 010-1234-5678",
  },
  {
    type: "textfield",
    title: "학번을 입력해주세요",
    value: "예: 20241234",
  },
  {
    type: "option-select",
    title: "유의사항을 확인하셨나요?",
    optional: true,
    options: [{ value: "확인", label: "예, 확인했습니다." }],
  },
  {
    type: "option-select",
    title: "해당 행사의 참여 방식을 선택해주세요",
    optional: true,
    options: [
      { value: "온라인", label: "온라인으로 참여하겠습니다." },
      { value: "오프라인", label: "오프라인으로 참여하겠습니다." },
    ],
  },
  {
    type: "option-select",
    title: "뒤풀이에 참여하겠습니까?",
    optional: true,
    options: [
      { value: "참여", label: "참여합니다." },
      { value: "불참", label: "참여하지 않겠습니다." },
    ],
  },
  {
    type: "option-select",
    title: "선입금을 완료하였나요",
    optional: true,
    options: [{ value: "선입금", label: "예, 완료했습니다." }],
  },
];

export const EventForm = () => {
  const [requiredByIndex, setRequiredByIndex] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(formFields.map((_, i) => [i, true])),
  );

  const handleRequiredToggle = (index: number, next: boolean) => {
    setRequiredByIndex(prev => ({ ...prev, [index]: next }));
  };

  console.log(requiredByIndex);
  return (
    <div>
      <Space height={16} />
      <Button size="sm">게시하기</Button>
      <Space height={30} />
      <TextField
        label=""
        placeholder="행사 신청 폼 설명을 입력해주세요"
        css={css({
          "width": "100%",
          "& textarea": {
            height: "100px !important",
          },
        })}
      />
      <Space height={32} />
      <Flex gap="sm" direction="column">
        {formFields.map((field, index) => (
          <FormField
            key={`${field.title} - ${index}`}
            {...field}
            optionalChecked={requiredByIndex[index]}
            onOptionalChange={checked => handleRequiredToggle(index, checked)}
          />
        ))}
      </Flex>
    </div>
  );
};
