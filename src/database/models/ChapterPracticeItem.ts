import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * Chapter practice items table model.
 */
export class ChapterPracticeItem extends Model {
  static table = 'chapterpracticeitems';

  @field('chapter_id') chapterId!: string;
  @field('question') question!: string;
  @field('explanation') explanation!: string;
  @field('difficulty') difficulty!: string;
}
