import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * Chapter practice options table model.
 */
export class ChapterPracticeOption extends Model {
  static table = 'chapterpracticeoptions';

  @field('practice_item_id') practiceItemId!: string;
  @field('text') text!: string;
  @field('is_correct') isCorrect!: boolean;
}
