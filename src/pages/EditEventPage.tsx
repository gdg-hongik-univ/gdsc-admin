import Tabs from "wowds-ui/Tabs";
import TabsContent from "wowds-ui/TabsContent";
import TabsItem from "wowds-ui/TabsItem";
import TabsList from "wowds-ui/TabsList";
import { Space } from "@/components/@common/Space";
import { EventForm } from "@/components/EditEvent/EventForm";
import { EventInformation } from "@/components/EditEvent/EventInformation";

export const EditEventPage = () => {
  return (
    <>
      <EventInformation />
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
