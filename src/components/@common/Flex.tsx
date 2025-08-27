import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { space as wowSpace } from "wowds-tokens";
type SpaceKey = keyof typeof wowSpace;

export const Flex = styled.div<{
  direction?: string;
  justify?: string;
  align?: string;
  margin?: SpaceKey;
  padding?: SpaceKey;
  gap?: SpaceKey;
  css?: ReturnType<typeof css>;
}>`
  display: flex;
  flex-direction: ${({ direction }) => (direction ? `${direction}` : "row")};
  justify-content: ${({ justify }) => (justify ? `${justify}` : "center")};
  align-items: ${({ align }) => (align ? `${align}` : "center")};
  gap: ${({ gap }) => (gap ? wowSpace[gap] : "0px")};
  margin: ${({ margin }) => (margin ? wowSpace[margin] : "0")};
  padding: ${({ padding }) => (padding ? wowSpace[padding] : "0")};
  width: 100%;
  box-sizing: border-box;
  ${({ css }) => css}
`;
