// components/OfflineEventCard.tsx
import { ComponentProps } from "react";
import { Text } from "components/@common/Text";
import Box from "wowds-ui/Box";
import Tag from "wowds-ui/Tag";
import { Flex } from "@/components/@common/Flex";
import { Space } from "@/components/@common/Space";
import { useCountdown } from "@/hooks/contexts/useCountDownDate";
import { EventStatus } from "@/types/entities/event";

interface OfflineEventCardProps {
  eventId: number;
  name: string;
  startAt: string;
  applicationStart: string;
  applicationEnd: string;
  totalAttendeesCount: number;
  eventStatus: EventStatus;
  onClick: () => void;
}

export const getStatusMeta = (
  status: EventStatus,
): { label: string; color: ComponentProps<typeof Tag>["color"] } => {
  switch (status) {
    case "BEFORE_APPLICATION":
      return { label: "신청 전", color: "grey" };
    case "APPLICATION_OPEN":
      return { label: "신청 중", color: "blue" };
    case "APPLICATION_CLOSED":
      return { label: "신청 종료", color: "green" };
    case "ONGOING":
      return { label: "진행 중", color: "green" };
    case "EVENT_ENDED":
      return { label: "행사 종료", color: "grey" };
    default:
      return { label: "알 수 없음", color: "grey" };
  }
};

export const OfflineEventCard = ({
  eventId,
  name,
  startAt,
  applicationStart,
  applicationEnd,
  totalAttendeesCount,
  eventStatus,
  onClick,
}: OfflineEventCardProps) => {
  const period = `${new Date(applicationStart).toLocaleDateString()} ~ ${new Date(applicationEnd).toLocaleDateString()}`;
  const { text: remainText } = useCountdown(
    eventStatus === "APPLICATION_OPEN" ? applicationEnd : null,
  );

  return (
    <div key={eventId} onClick={onClick}>
      <Box
        text={
          <>
            <Flex justify="start" gap="xs">
              <Text typo="h2">{name}</Text>
              <Tag color={getStatusMeta(eventStatus).color} variant="solid2">
                {getStatusMeta(eventStatus).label}
              </Tag>
            </Flex>

            <Space height={8} />
            {eventStatus === "APPLICATION_OPEN" ? (
              <Text typo="body1" color="sub">
                <Text as="span" color="error">
                  신청 마감까지{" "}
                </Text>
                {remainText} 남음
              </Text>
            ) : (
              <Text typo="body1" color="sub">
                {period}
              </Text>
            )}

            <Space height="lg" />
            <Text typo="body1" color="sub">
              행사일: {new Date(startAt).toLocaleDateString()}
            </Text>
            <Space height={5} />
            <Text typo="body1" color="sub">
              참석인원: {totalAttendeesCount}명
            </Text>
          </>
        }
        style={boxStyle}
      />
    </div>
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
