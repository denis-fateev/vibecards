import type { ComponentProps } from 'react';
import styled from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === 'primary' ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  background: ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.accent : theme.colors.surface};
  color: ${({ theme, $variant }) =>
    $variant === 'primary' ? '#fff' : theme.colors.text};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return <StyledButton $variant={variant} type={type} {...props} />;
}
