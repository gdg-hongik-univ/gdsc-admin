import { BASE_URL } from "@/environment";

const RoutePath = {
  Index: "/",

  AllMembers: "/member/all",
  PendingMembers: "/member/pending",

  PaymentStatus: "/payment/payment-status",
  Coupon: "/payment/coupon",
  IssuedCoupon: "/payment/coupon/issued",
  CouponProvision: "/payment/coupon/provision",

  Recruitment: "/recruitment",
  RecruitmentRound: "/recruitment/round",

  AllMemberHistoryPerSemester: "/history/all-member-per-semester",
  PaymentStatusHistoryPerSemester: "/history/payment-status-per-semester",

  Signin: "/sign-in",

  AuthorizedError: "/authorized-error",
  GithubLoginRedirect: `${BASE_URL}/oauth2/authorization/github`,
  AuthServerRedirect: "/social-login/redirect",

  OfflineEventManage: "/offline-event-manage",
  EditEvent: "/offline-event-manage/edit",
  Error: "/error",
} as const;

export default RoutePath;
