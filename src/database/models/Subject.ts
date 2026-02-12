import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * Subjects table model.
 */
export class Subject extends Model {
  static table = 'subjects';

  @field('name') name!: string;
  @field('level') level!: string;
  @field('exam_tags') examTags!: string;
}
