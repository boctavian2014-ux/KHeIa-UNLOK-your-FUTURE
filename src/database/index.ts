import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Database } from '@nozbe/watermelondb';

import { schema } from './schema';
import { migrations } from './migrations';
import { Subject } from './models/Subject';
import { Chapter } from './models/Chapter';
import { ChapterDetail } from './models/ChapterDetail';
import { ChapterPracticeItem } from './models/ChapterPracticeItem';
import { ChapterPracticeOption } from './models/ChapterPracticeOption';
import { UserChapterProgress } from './models/UserChapterProgress';
import { UserQuizItem } from './models/UserQuizItem';
import { Test } from './models/Test';
import { TestItem } from './models/TestItem';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: false,
});

export const database = new Database({
  adapter,
  modelClasses: [
    Subject,
    Chapter,
    ChapterDetail,
    ChapterPracticeItem,
    ChapterPracticeOption,
    UserChapterProgress,
    UserQuizItem,
    Test,
    TestItem,
  ],
});
