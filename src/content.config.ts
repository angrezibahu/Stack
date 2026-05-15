import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const THREADS = ['abstraction', 'encoding', 'state-and-memory', 'protocols-and-contracts'] as const;

// Module metadata lives at src/content/modules/<slug>/_module.mdx.
// Lessons live at src/content/modules/<slug>/<lesson>.mdx (any file not starting with "_").
const modules = defineCollection({
  loader: glob({
    pattern: '*/_module.{md,mdx}',
    base: './src/content/modules',
  }),
  schema: z.object({
    title: z.string(),
    number: z.number().int().min(1),
    summary: z.string(),
    difficulty: z.number().int().min(1).max(3),
    status: z.enum(['available', 'coming-soon']).default('coming-soon'),
  }),
});

const lessons = defineCollection({
  loader: glob({
    pattern: '*/[!_]*.{md,mdx}',
    base: './src/content/modules',
  }),
  schema: z.object({
    title: z.string(),
    order: z.number().int().min(1),
    estimated_minutes: z.number().int().min(1).default(10),
    threads: z.array(z.enum(THREADS)).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { modules, lessons };

export const THREAD_KEYS = THREADS;
export type ThreadKey = (typeof THREADS)[number];

export const THREAD_META: Record<ThreadKey, { name: string; description: string }> = {
  abstraction: {
    name: 'Abstraction',
    description:
      'How we hide complexity behind interfaces — and what leaks through when we do. From transistor to logic gate to instruction to function to LLM prompt, every layer is someone’s simplification of the one below it.',
  },
  encoding: {
    name: 'Encoding',
    description:
      'How meaning is stored and moved as bits. Numbers, text, instructions, images, weights, tokens — encoding is the choice of which patterns we agree count as which things.',
  },
  'state-and-memory': {
    name: 'State and Memory',
    description:
      'What a system remembers, where, and for how long. Registers, caches, RAM, disk, KV caches, context windows — different memories with different speeds, costs, and lifetimes.',
  },
  'protocols-and-contracts': {
    name: 'Protocols and Contracts',
    description:
      'The agreed-upon rules that let independent parts cooperate. Instruction set architectures, calling conventions, network protocols, type signatures, API schemas — the unglamorous interfaces that make composition possible.',
  },
};
