import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * User quiz history model.
 */
export class UserQuizItem extends Model {
  static table = 'userquizitems';

  @field('user_id') userId!: string;
  @field('practice_item_id') practiceItemId!: string;
  @field('answered_at') answeredAt!: number;
  @field('is_correct') isCorrect!: boolean;
}
