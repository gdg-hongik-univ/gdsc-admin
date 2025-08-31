import { css } from "@emotion/react";
import { Text } from "components/@common/Text";
import { useNavigate } from "react-router-dom";
import Box from "wowds-ui/Box";

import SearchBar from "wowds-ui/SearchBar";

import { Space } from "@/components/@common/Space";
import { OfflineEventCard } from "@/components/OfflineEvent/EventBox";
import { useEventList } from "@/hooks/queries/useGetEventQueries";
import RoutePath from "@/routes/routePath";

export const EventsHomePage = () => {
  const navigate = useNavigate();
  const { data } = useEventList(0, 20);
  const eventContent = data?.content ?? [];

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

      <div
        css={css({
          flexWrap: "wrap",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        })}
      >
        {/* 템플릿 추가하기 박스 */}
        <div onClick={() => navigate(`${RoutePath.EditEvent}/new`)}>
          <Box
            text={
              <Text typo="h3" color="sub">
                + 템플릿 추가하기
              </Text>
            }
            style={boxStyle}
          />
        </div>

        {/* 실제 이벤트 데이터 리스트 */}
        {eventContent.map(item => (
          <OfflineEventCard
            key={item.event.eventId}
            eventId={item.event.eventId}
            name={item.event.name}
            startAt={item.event.startAt}
            applicationStart={item.event.applicationPeriod.startDate}
            applicationEnd={item.event.applicationPeriod.endDate}
            totalAttendeesCount={item.totalAttendeesCount}
            eventStatus={item.eventStatus}
            onClick={() => navigate(`${RoutePath.EditEvent}/${item.event.eventId}`)}
          />
        ))}
      </div>
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
