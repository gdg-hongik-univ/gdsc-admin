import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { space as wowSpace } from "wowds-tokens";
type SpaceKey = keyof typeof wowSpace;

const getSpace = (space?: number | SpaceKey) => {
  if (typeof space === "number") {
    return `${space}px`;
  } else if (space && space in wowSpace) {
    return wowSpace[space];
  }
  return "";
};

export const Space = styled.div<{
  height?: number | SpaceKey;
  width?: number | SpaceKey;
  css?: ReturnType<typeof css>;
}>`
  height: ${({ height }) => getSpace(height)};
  width: ${({ width }) => getSpace(width)};
  ${({ css }) => css}
`;
