import { ProgressBar } from '@/components/ui/ProgressBar';

type ChapterSetProgressProps = {
  progress: number;
};

export const ChapterSetProgress = ({ progress }: ChapterSetProgressProps) => {
  return <ProgressBar progress={progress} />;
};
