import { css } from "@emotion/react";
import { Text } from "components/@common/Text";
import { useNavigate } from "react-router-dom";
import Box from "wowds-ui/Box";

import SearchBar from "wowds-ui/SearchBar";
import Tag from "wowds-ui/Tag";
import { Flex } from "@/components/@common/Flex";
import { Space } from "@/components/@common/Space";
import RoutePath from "@/routes/routePath";

export const OfflineEventManagePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Text typo="h1" as="h1">
        오프라인 행사 페이지
      </Text>
      <Space height="lg" />
      <SearchBar placeholder="찾고 싶은 행사 이름을 입력하세요" />
      <Space height={54} />
      <Text>행사 신청 폼 목록</Text>
      <Space height="lg" />
      <Flex gap="sm" css={css({ flexWrap: "wrap" })} justify="start" align="stretch">
        <div onClick={() => navigate(RoutePath.EditEvent)}>
          <Box
            text={
              <Text typo="h3" color="sub">
                + 템플릿 추가하기
              </Text>
            }
            style={boxStyle}
          />
        </div>
        <div onClick={() => navigate(RoutePath.EditEvent)}>
          <Box
            text={
              <>
                <Flex justify="start" gap="xs">
                  <Text typo="h2">개강총회</Text>
                  <Tag color="blue" variant="solid2">
                    신청 중
                  </Tag>
                </Flex>

                <Space height={8} />
                <Text typo="body1" color="sub">
                  2024년 5월23일 ~ 2024년 5월26일
                </Text>
                <Space height="lg" />
                <Text typo="body1" color="sub">
                  행사일
                </Text>
                <Space height={5} />
                <Text typo="body1" color="sub">
                  참석인원
                </Text>
              </>
            }
            style={boxStyle}
          />
        </div>
      </Flex>
    </>
  );
};

const boxStyle: React.CSSProperties = {
  flex: "0 0 calc(33.333% - 10px)",
  minHeight: "182px",
  height: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  cursor: "pointer",
};
