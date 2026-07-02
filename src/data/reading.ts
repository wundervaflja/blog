export type ReadingStatus = 'reading' | 'queued' | 'finished' | 'paused';

export interface ReadingItem {
  title: string;
  author: string;
  status: ReadingStatus;
  category: string;
  url?: string;
  note?: string;
}

export const readingList: ReadingItem[] = [];

export const readingStatusLabels: Record<ReadingStatus, string> = {
  reading: 'currently reading',
  queued: 'want to read',
  finished: 'recommended',
  paused: 'paused',
};

export const readingStatusOrder: ReadingStatus[] = [
  'reading',
  'queued',
  'finished',
  'paused',
];
