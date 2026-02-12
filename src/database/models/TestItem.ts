import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * Test items model.
 */
export class TestItem extends Model {
  static table = 'testitems';

  @field('test_id') testId!: string;
  @field('practice_item_id') practiceItemId!: string;
  @field('order') order!: number;
}
