import styled from 'styled-components';

type PlaceholderProps = {
  children: string;
};

const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9375rem;
`;

export function Placeholder({ children }: PlaceholderProps) {
  return <Text>{children}</Text>;
}
