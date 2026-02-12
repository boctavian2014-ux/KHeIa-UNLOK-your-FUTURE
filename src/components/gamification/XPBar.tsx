import { ProgressBar } from '@/components/ui/ProgressBar';

type XPBarProps = {
  progress: number;
};

export const XPBar = ({ progress }: XPBarProps) => {
  return <ProgressBar progress={progress} />;
};
