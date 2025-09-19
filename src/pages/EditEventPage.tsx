import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "wowds-ui/Tabs";
import TabsContent from "wowds-ui/TabsContent";
import TabsItem from "wowds-ui/TabsItem";
import TabsList from "wowds-ui/TabsList";
import { Space } from "@/components/@common/Space";
import { ApplyMember } from "@/components/EditEvent/ApplyMembers";
import { EventForm } from "@/components/EditEvent/EventForm";
import { EventInformation } from "@/components/EditEvent/EventInformation";
import { useGetEvent } from "@/hooks/queries/useGetEvent";
import { EventType } from "@/types/dtos/event";

export const EditEventPage = () => {
  const { eventId: eventIdParam } = useParams<{ eventId?: string }>();
  const isNew = eventIdParam === "new";
  const id = !isNew && eventIdParam ? Number(eventIdParam) : null;

  const { data: eventData, isLoading, error } = useGetEvent(id ?? null);
  const [formValues, setformValues] = useState<EventType | null>(null);

  useEffect(() => {
    if (isNew || id === null) {
      // 새로운 이벤트 생성 시 초기값 설정
      const initialEventData: EventType = {
        eventId: -1, //NOTE: 0이 아니라 새로운 이벤트 생성 시 이벤트 ID 생성
        name: "",
        venue: "추후 공지 예정",
        startAt: "",
        applicationDescription: "",
        applicationPeriod: {
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
        },
        regularRoleOnlyStatus: "ENABLED",
        afterPartyStatus: "ENABLED",
        prePaymentStatus: "ENABLED",
        postPaymentStatus: "ENABLED",
        rsvpQuestionStatus: "ENABLED",
        noticeConfirmQuestionStatus: "ENABLED",

        mainEventMaxApplicantCount: null,
        afterPartyMaxApplicantCount: null,
      };
      setformValues(initialEventData);
    } else if (eventData) {
      setformValues(eventData.eventData);
    }
  }, [id, isNew, eventData]);

  if (isLoading) {
    return <div>이벤트 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div>이벤트 정보를 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <>
      <EventInformation
        formValue={formValues}
        setFormValues={setformValues}
        eventId={id || undefined}
        totalAttendeesCount={eventData?.totalAttendeesCount || 0}
      />

      <Space height={54} />
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsItem value="tab1">행사 신청 폼</TabsItem>
          <TabsItem value="tab2">신청 인원</TabsItem>
        </TabsList>
        <TabsContent value="tab1">
          <EventForm
            formValue={formValues}
            setFormValues={setformValues}
            eventId={id || undefined}
            totalAttendeesCount={eventData?.totalAttendeesCount || 0}
          />
        </TabsContent>
        <TabsContent value="tab2">
          <ApplyMember title={formValues?.name || ""}/>
        </TabsContent>
      </Tabs>
    </>
  );
};
