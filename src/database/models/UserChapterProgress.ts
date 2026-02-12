import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * User chapter progress model.
 */
export class UserChapterProgress extends Model {
  static table = 'userchapterprogress';

  @field('user_id') userId!: string;
  @field('chapter_id') chapterId!: string;
  @field('status') status!: string;
  @field('last_quiz_score') lastQuizScore!: number;
  @field('updated_at') updatedAt!: number;
}
