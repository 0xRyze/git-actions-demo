import styled from '@emotion/styled'

export const PaginationContainer = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style-type: none;
`

export const PaginationItem = styled.li`
  padding: 0 12px;
  height: 32px;
  min-width: 32px;
  text-align: center;
  margin: auto 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;

  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;

    &:hover {
      background-color: transparent;
      cursor: default;
    }
  `}

  &.dots:hover {
    background-color: transparent;
    cursor: default;
  }
  &:hover {
    background-color: var(--bad-colors-muted);
    cursor: pointer;
  }

  &.selected {
    background-color: var(--bad-colors-muted);
  }

  &.disabled {
  }
`
