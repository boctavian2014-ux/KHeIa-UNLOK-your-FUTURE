import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * Test session model.
 */
export class Test extends Model {
  static table = 'tests';

  @field('user_id') userId!: string;
  @field('type') type!: string;
  @field('subject_set') subjectSet!: string;
  @field('started_at') startedAt!: number;
  @field('finished_at') finishedAt!: number;
  @field('score') score!: number;
  @field('duration_seconds') durationSeconds!: number;
}
