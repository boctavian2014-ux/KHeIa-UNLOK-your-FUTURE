import { useState, useEffect, useCallback } from 'react';
import {
  getCatalogFromSupabase,
  type Subject,
  type Chapter,
  type ChapterDetail,
} from '@/services/catalog.service';

type CatalogState = {
  subjects: Subject[];
  chapters: Chapter[];
  chapterDetails: ChapterDetail[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useCatalog(): CatalogState {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterDetails, setChapterDetails] = useState<ChapterDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const catalog = await getCatalogFromSupabase();
      setSubjects(catalog.subjects);
      setChapters(catalog.chapters);
      setChapterDetails(catalog.chapterDetails);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la încărcare');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    subjects,
    chapters,
    chapterDetails,
    loading,
    error,
    refetch: load,
  };
}
