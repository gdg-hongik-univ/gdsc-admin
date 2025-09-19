import { useState } from "react";
import { css } from "@emotion/react";
import { Text } from "components/@common/Text";
import { Link, useNavigate } from "react-router-dom";
import Box from "wowds-ui/Box";
import Pagination from "wowds-ui/Pagination";
import SearchBar from "wowds-ui/SearchBar";

import { Space } from "@/components/@common/Space";
import { OfflineEventCard } from "@/components/OfflineEvent/EventBox";
import { useDebounce } from "@/hooks/common/useDebounce";
import { useEventList } from "@/hooks/queries/useGetEventQueries";
import RoutePath from "@/routes/routePath";

export const EventsHomePage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 20;

  const { data } = useEventList(currentPage, pageSize); // useEventList는 1부터 시작
  const eventContent = data?.content ?? [];

  // 검색어 debounce 적용 (300ms 지연)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 검색어에 따라 이벤트 필터링
  const filteredEvents = eventContent.filter(event =>
    event.event.name?.toLowerCase().includes(debouncedSearchQuery?.toLowerCase()),
  );

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // Pagination은 1부터 시작하지만 API는 0부터 시작
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0); // 검색 시 첫 페이지로 이동
  };

  return (
    <>
      <Text typo="h1" as="h1">
        오프라인 행사 페이지
      </Text>
      <Space height="lg" />
      <SearchBar
        placeholder="찾고 싶은 행사 이름을 입력하세요"
        value={searchQuery}
        onChange={handleSearchChange}
      />
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
        <Link to={`${RoutePath.EditEvent}/new`}>
          <Box
            text={
              <Text typo="h3" color="sub">
                + 템플릿 없이 새로운 폼 만들기
              </Text>
            }
            style={boxStyle}
          />
        </Link>

        {/* 실제 이벤트 데이터 리스트 */}
        {filteredEvents.length > 0 ? (
          filteredEvents.map(item => (
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
          ))
        ) : debouncedSearchQuery ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
            <Text typo="body1" color="sub">
              "{debouncedSearchQuery}"에 해당하는 행사를 찾을 수 없습니다.
            </Text>
          </div>
        ) : null}
      </div>

      <Space height={54} />

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          onChange={handlePageChange}
          totalPages={data?.totalPages || 1}
          currentPage={currentPage + 1} // Pagination은 1부터 시작
        />
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
