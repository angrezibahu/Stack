import { getCollection, type CollectionEntry } from 'astro:content';

export type Module = CollectionEntry<'modules'>;
export type Lesson = CollectionEntry<'lessons'>;

// Lesson `id` example: "01-what-is-an-llm/01-the-shape-of-the-thing"
export function moduleSlugOfLesson(lesson: Lesson): string {
  return lesson.id.split('/')[0]!;
}

// Strip the numeric prefix from a folder for the URL slug.
// "01-what-is-an-llm" -> "what-is-an-llm"
export function urlSlugFromFolder(folder: string): string {
  return folder.replace(/^\d+-/, '');
}

export function lessonSlugFromId(id: string): string {
  const file = id.split('/')[1] ?? id;
  return file.replace(/^\d+-/, '');
}

export async function getAllModulesSorted(): Promise<Module[]> {
  const all = await getCollection('modules');
  return all.sort((a, b) => a.data.number - b.data.number);
}

export async function getLessonsForModule(moduleFolder: string): Promise<Lesson[]> {
  const all = await getCollection('lessons');
  return all
    .filter((l) => moduleSlugOfLesson(l) === moduleFolder && !l.data.draft)
    .sort((a, b) => a.data.order - b.data.order);
}

export function lessonHref(moduleFolder: string, lessonId: string): string {
  return `/modules/${urlSlugFromFolder(moduleFolder)}/${lessonSlugFromId(lessonId)}`;
}

export function moduleHref(moduleFolder: string): string {
  return `/modules/${urlSlugFromFolder(moduleFolder)}`;
}
