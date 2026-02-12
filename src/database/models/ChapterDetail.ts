import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

/**
 * Chapter details table model.
 */
export class ChapterDetail extends Model {
  static table = 'chapterdetails';

  @field('chapter_id') chapterId!: string;
  @field('overview') overview!: string;
  @field('sections') sections!: string;
  @field('keypoints') keypoints!: string;
}
