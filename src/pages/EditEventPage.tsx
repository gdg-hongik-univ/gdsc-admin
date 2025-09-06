import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "wowds-ui/Tabs";
import TabsContent from "wowds-ui/TabsContent";
import TabsItem from "wowds-ui/TabsItem";
import TabsList from "wowds-ui/TabsList";
import { Space } from "@/components/@common/Space";
import { EventForm } from "@/components/EditEvent/EventForm";
import { EventInformation } from "@/components/EditEvent/EventInformation";
import { useEventList } from "@/hooks/queries/useGetEventQueries";
import { EventType } from "@/types/dtos/event";

export const EditEventPage = () => {
  const { eventId: eventIdParam } = useParams<{ eventId?: string }>();
  const isNew = eventIdParam === "new";
  const id = !isNew ? Number(eventIdParam) : null;

  const { data } = useEventList(0, 20);
  const [infoValues, setInfoValues] = useState<EventType | null>(null);

  useEffect(() => {
    if (isNew || id === null) {
      setInfoValues(null);
    } else {
      setInfoValues(data?.content.find(c => c.event.eventId === id)?.event ?? null);
    }
  }, [data, id, isNew]);

  return (
    <>
      <EventInformation formValue={infoValues} setFormValues={setInfoValues} />

      <Space height={54} />
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsItem value="tab1">행사 신청 폼</TabsItem>
          <TabsItem value="tab2">신청 인원</TabsItem>
        </TabsList>
        <TabsContent value="tab1">
          <EventForm />
        </TabsContent>
        <TabsContent value="tab2">신청 인원 내용</TabsContent>
      </Tabs>
    </>
  );
};
