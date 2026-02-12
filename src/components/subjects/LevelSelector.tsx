import { PillToggle } from '@/components/ui/PillToggle';

type LevelSelectorProps = {
  level: 'gimnaziu' | 'liceu';
  onChange: (level: 'gimnaziu' | 'liceu') => void;
};

export const LevelSelector = ({ level, onChange }: LevelSelectorProps) => {
  return (
    <PillToggle
      leftLabel="Gimnaziu"
      rightLabel="Liceu"
      value={level === 'gimnaziu' ? 'left' : 'right'}
      onChange={(value) => onChange(value === 'left' ? 'gimnaziu' : 'liceu')}
    />
  );
};
