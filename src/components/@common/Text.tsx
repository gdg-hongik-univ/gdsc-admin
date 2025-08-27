import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { color as wowColor, typography as wowTypo } from "wowds-tokens";

type ColorKey = keyof typeof wowColor;
type TypoKey = keyof typeof wowTypo;
/**
 * @description 와우 디자인 시스템 토큰을 사용한 Text 컴포넌트
 */
export const Text = styled.p<{
  typo?: TypoKey;
  color?: ColorKey;
  css?: ReturnType<typeof css>;
}>`
  font-family: "SUIT v1", "Apple SD Gothic Neo";
  ${({ typo = "body1" }) => wowTypo[typo]};
  color: ${({ color = "textBlack" }) => wowColor[color]};
  text-align: start;

  white-space: pre-wrap;
  word-break: keep-all;

  margin: 0;
  padding: 0;

  ${({ css }) => css}
`;
