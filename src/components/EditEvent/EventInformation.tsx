import { CSSProperties, useEffect, useState } from "react";
import { css } from "@emotion/react";
import { color, space } from "wowds-tokens";
import DropDown from "wowds-ui/DropDown";
import DropDownOption from "wowds-ui/DropDownOption";
import PickerGroup from "wowds-ui/PickerGroup";
import RangeDatePicker from "wowds-ui/RangeDatePicker";
import DatePicker from "wowds-ui/SingleDatePicker";
import TextField from "wowds-ui/TextField";
import TimePicker from "wowds-ui/TimePicker";
import { Flex } from "@/components/@common/Flex";
import { Space } from "@/components/@common/Space";
import { Text } from "@/components/@common/Text";
import { EventType } from "@/types/dtos/event";

const parseISO = (s?: string): Date | undefined => (s ? new Date(s) : undefined);
const toISOOrEmpty = (d?: Date) => (d ? d.toISOString() : "");

export const EventInformation = ({
  formValue,
  setFormValues,
}: {
  formValue: EventType | null;
  setFormValues: (value: React.SetStateAction<EventType | null>) => void;
}) => {
  //const [formValues, setFormValues] = useState<EventType | null>(formValue);
  const [selectedRange, setSelectedRange] = useState<
    { from: Date | undefined; to: Date | undefined } | undefined
  >(() => {
    if (!formValue) {
      return undefined;
    }
    return {
      from: parseISO(formValue.applicationPeriod?.startDate),
      to: parseISO(formValue.applicationPeriod?.endDate),
    };
  });

  const [selectedEventDate, setSelectedEventDate] = useState<Date | undefined>(
    formValue?.startAt ? new Date(formValue?.startAt) : undefined,
  );

  useEffect(() => {
    setFormValues(formValue);
    setSelectedRange(
      formValue
        ? {
            from: new Date(formValue.applicationPeriod?.startDate),
            to: new Date(formValue.applicationPeriod?.endDate),
          }
        : undefined,
    );
    setSelectedEventDate(formValue?.startAt ? new Date(formValue?.startAt) : undefined);
  }, [formValue]);

  return (
    <>
      <div
        css={css({
          backgroundColor: color.backgroundAlternative,
          padding: "30px",
          borderRadius: space.md,
          marginTop: "30px",
        })}
      >
        <Text typo="h2">행사 기본 정보를 입력해주세요</Text>
        <Space height="lg" />
        <Flex justify="start" style={{ flexWrap: "wrap" }} gap="sm">
          <TextField
            label="행사이름"
            placeholder="행사 이름을 선택해주세요"
            style={formItemStyle}
            value={formValue?.name ?? ""}
            onChange={value => setFormValues(prev => (prev ? { ...prev, name: value } : prev))}
          />

          <DropDown
            label="신청범위"
            placeholder="신청 범위를 선택해주세요"
            style={formItemStyle}
            value={formValue?.regularRoleOnlyStatus === "ENABLED" ? "only-member" : "everyone"}
            onChange={value =>
              setFormValues(prev =>
                prev
                  ? {
                      ...prev,
                      regularRoleOnlyStatus:
                        value.selectedValue === "only-member" ? "ENABLED" : "DISABLED",
                    }
                  : prev,
              )
            }
          >
            <DropDownOption value="only-member" text="정회원만 신청 가능" />
            <DropDownOption value="everyone" text="모두 신청 가능" />
          </DropDown>
          <RangeDatePicker
            label="행사 진행 일시"
            selected={selectedRange}
            onSelect={range => {
              setSelectedRange({
                from: range?.from,
                to: range?.to,
              });

              // 2) 서버 DTO도 함께 업데이트
              setFormValues(prev =>
                prev
                  ? {
                      ...prev,
                      applicationPeriod: {
                        startDate: toISOOrEmpty(range?.from),
                        endDate: toISOOrEmpty(range?.to),
                      },
                    }
                  : prev,
              );
            }}
            style={formItemStyle}
          />
          <PickerGroup
            selectedDate={selectedEventDate}
            setSelectedDate={date => {
              setSelectedEventDate(date);
              setFormValues(prev => (prev ? { ...prev, startAt: toISOOrEmpty(date) } : prev));
            }}
            label=""
          >
            <DatePicker label="행사 진행 날짜" />
            <TimePicker label="행사 진행 시간" />
          </PickerGroup>
        </Flex>
      </div>
    </>
  );
};
const formItemStyle: CSSProperties = {
  flex: "0 0 calc(50% - 8px)",
  boxSizing: "border-box",
};
