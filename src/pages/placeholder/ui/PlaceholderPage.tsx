import styled from 'styled-components';

import type { NavItem } from '@/shared/config/navigation';
import { Placeholder } from '@/shared/ui/Placeholder';

const PageTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

type PlaceholderPageProps = {
  section: NavItem;
};

export function PlaceholderPage({ section }: PlaceholderPageProps) {
  return (
    <>
      <PageTitle>{section.label}</PageTitle>
      <Placeholder>Раздел в разработке.</Placeholder>
    </>
  );
}
