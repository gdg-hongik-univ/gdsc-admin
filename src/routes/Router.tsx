import { RouteObject, createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/components/@layout/Layout";
import AllMemberHistoryPerSemesterPage from "@/pages/AllMemberHistoryPerSemesterPage";
import AllMembersPage from "@/pages/AllMembersPage";
import AuthErrorPage from "@/pages/AuthErrorPage";
import AuthServerRedirectPage from "@/pages/AuthServerRedirectPage";
import CouponPage from "@/pages/CouponPage";
import CouponProvisionPage from "@/pages/CouponProvisionPage";
import { EditEventPage } from "@/pages/EditEventPage";
import IssuedCouponPage from "@/pages/IssuedCouponPage";
import NotFoundErrorPage from "@/pages/NotFoundErrorPage";
import { OfflineEventManagePage } from "@/pages/OfflineEventManagePage";
import PaymentStatusHistoryPerSemesterPage from "@/pages/PaymentStatusHistoryPerSemesterPage";
import PaymentStatusPage from "@/pages/PaymentStatusPage";
import PendingMembersPage from "@/pages/PendingMembersPage";
import RecruitmentPage from "@/pages/RecruitmentPage";
import RecruitmentRoundPage from "@/pages/RecruitmentRoundPage";
import SigninPage from "@/pages/SigninPage";
import RoutePath from "@/routes/routePath";

const routes: RouteObject[] = [
  {
    path: RoutePath.Index,
    element: <Layout />,
    children: [
      { path: "", element: <Navigate to={RoutePath.AllMembers} replace /> },
      {
        path: RoutePath.AllMembers,
        element: <AllMembersPage />,
      },
      { path: RoutePath.PendingMembers, element: <PendingMembersPage /> },
      { path: RoutePath.PaymentStatus, element: <PaymentStatusPage /> },
      { path: RoutePath.Coupon, element: <CouponPage /> },
      { path: RoutePath.IssuedCoupon, element: <IssuedCouponPage /> },
      { path: RoutePath.CouponProvision, element: <CouponProvisionPage /> },
      { path: RoutePath.Recruitment, element: <RecruitmentPage /> },
      { path: RoutePath.RecruitmentRound, element: <RecruitmentRoundPage /> },
      { path: RoutePath.AllMemberHistoryPerSemester, element: <AllMemberHistoryPerSemesterPage /> },
      {
        path: RoutePath.PaymentStatusHistoryPerSemester,
        element: <PaymentStatusHistoryPerSemesterPage />,
      },
      {
        path: RoutePath.OfflineEventManage,
        element: <OfflineEventManagePage />,
      },

      {
        path: RoutePath.EditEvent,
        element: <EditEventPage />,
      },
    ],
  },
  { path: RoutePath.Signin, element: <SigninPage /> },
  { path: RoutePath.AuthServerRedirect, element: <AuthServerRedirectPage /> },
  {
    path: RoutePath.AuthorizedError,
    element: <AuthErrorPage />,
  },
  { path: "*", element: <NotFoundErrorPage /> },
];

const Router = createBrowserRouter(routes);

export default Router;
