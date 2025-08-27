import { CSSProperties, useState } from "react";
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

export const EventInformation = () => {
  const [selected, setSelected] = useState<
    | {
        from: Date | undefined;
        to?: Date | undefined;
      }
    | undefined
  >();
  const [selectedEventDate, setSelectedEventDate] = useState<Date | undefined>(new Date());
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
          />
          <DropDown label="신청범위" placeholder="신청 범위를 선택해주세요" style={formItemStyle}>
            <DropDownOption value="only-member" text="정회원만 신청 가능" />
            <DropDownOption value="everyone" text="모두 신청 가능" />
          </DropDown>
          <RangeDatePicker
            label="행사 진행 일시"
            selected={selected}
            onSelect={setSelected}
            style={formItemStyle}
          />
          <PickerGroup selectedDate={selectedEventDate} setSelectedDate={setSelectedEventDate}>
            <DatePicker label="종료 날짜" />
            <TimePicker label="종료 시간" />
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
