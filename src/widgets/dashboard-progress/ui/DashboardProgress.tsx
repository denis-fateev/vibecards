import { Card } from '@/shared/ui/Card';
import { Placeholder } from '@/shared/ui/Placeholder';
import { SectionTitle } from '@/shared/ui/SectionTitle';

export function DashboardProgress() {
  return (
    <Card>
      <SectionTitle>Прогресс</SectionTitle>
      <Placeholder>
        Всего карточек, изучаются, на повторении, просрочены — заглушка.
      </Placeholder>
    </Card>
  );
}
