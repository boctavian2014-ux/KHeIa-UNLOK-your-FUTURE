import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * Chapters table model.
 */
export class Chapter extends Model {
  static table = 'chapters';

  @field('subject_id') subjectId!: string;
  @field('title') title!: string;
  @field('order') order!: number;
  @field('published') published!: boolean;
  @field('exam_tags') examTags!: string;
  @field('is_core_for_exam') isCoreForExam!: boolean;
}
