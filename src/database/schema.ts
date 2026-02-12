import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'subjects',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'level', type: 'string' },
        { name: 'exam_tags', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'chapters',
      columns: [
        { name: 'subject_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'order', type: 'number' },
        { name: 'published', type: 'boolean' },
        { name: 'exam_tags', type: 'string' },
        { name: 'is_core_for_exam', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'chapterdetails',
      columns: [
        { name: 'chapter_id', type: 'string' },
        { name: 'overview', type: 'string', isOptional: true },
        { name: 'sections', type: 'string' },
        { name: 'keypoints', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'chapterpracticeitems',
      columns: [
        { name: 'chapter_id', type: 'string' },
        { name: 'question', type: 'string' },
        { name: 'explanation', type: 'string', isOptional: true },
        { name: 'difficulty', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'chapterpracticeoptions',
      columns: [
        { name: 'practice_item_id', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'is_correct', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'userchapterprogress',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'chapter_id', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'last_quiz_score', type: 'number', isOptional: true },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'userquizitems',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'practice_item_id', type: 'string' },
        { name: 'answered_at', type: 'number' },
        { name: 'is_correct', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'tests',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'subject_set', type: 'string' },
        { name: 'started_at', type: 'number', isOptional: true },
        { name: 'finished_at', type: 'number', isOptional: true },
        { name: 'score', type: 'number', isOptional: true },
        { name: 'duration_seconds', type: 'number', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'testitems',
      columns: [
        { name: 'test_id', type: 'string' },
        { name: 'practice_item_id', type: 'string' },
        { name: 'order', type: 'number' },
      ],
    }),
  ],
});
