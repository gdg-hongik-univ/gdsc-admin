import { styled, Stack } from "@mui/material";
import LogoIcon from "@/assets/logo.svg?react";
import AccordionLinkListButton from "@/components/@common/SideNavbar/AccordionLinkListButton";
import {
  membersLinkButtonInfoList,
  paymentLinkButtonInfoList,
  recruitmentLinkButtonInfoList,
  historyLinkButtonInfoList,
} from "@/constants/common";
import RoutePath from "@/routes/routePath";

export default function SideNavbar() {
  return (
    <StyledSideNavbarWrapper>
      <StyledLogoIcon />
      <StyledLinkWrapper>
        <AccordionLinkListButton label="회원 관리" linkButtonInfoList={membersLinkButtonInfoList} />
        <AccordionLinkListButton label="회비 관리" linkButtonInfoList={paymentLinkButtonInfoList} />
        <AccordionLinkListButton
          label="리크루팅 관리"
          linkButtonInfoList={recruitmentLinkButtonInfoList}
        />
        <AccordionLinkListButton label="히스토리" linkButtonInfoList={historyLinkButtonInfoList} />
        <AccordionLinkListButton
          label="결제위젯 어드민"
          path={
            "https://dashboard.tosspayments.com/payment-widget-service/tm/931024/ui-setting-list"
          }
        />
        <AccordionLinkListButton label="오프라인 행사 관리" path={RoutePath.OfflineEventManage} />
      </StyledLinkWrapper>
    </StyledSideNavbarWrapper>
  );
}

const StyledSideNavbarWrapper = styled(Stack)({
  minWidth: "256px",
  gap: "32px",
  paddingTop: "32px",
  boxShadow: `0 2px 3px #00000033, 0 1px 1px #00000033, 0 1px 2px #0000001E`,
});

const StyledLogoIcon = styled(LogoIcon)({
  margin: "auto",
});

const StyledLinkWrapper = styled("ul")({
  height: "100%",
  padding: "8px",
});
