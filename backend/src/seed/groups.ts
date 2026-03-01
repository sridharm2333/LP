import { Group } from '../models';

const DEFAULT_GROUPS = [
  { name: 'Heartbreak Haven', topic: 'heartbreak', description: 'A space for those healing from heartbreak.' },
  { name: 'Grief & Loss', topic: 'grief', description: 'Support for grief and loss.' },
  { name: 'Loneliness Together', topic: 'loneliness', description: 'You are not alone in feeling alone.' },
  { name: 'Anxiety Calm', topic: 'anxiety', description: 'Gentle support for anxiety.' },
  { name: 'General Support', topic: 'general', description: 'General emotional support.' },
];

export async function seedGroups(): Promise<void> {
  const count = await Group.countDocuments();
  if (count > 0) return;
  await Group.insertMany(DEFAULT_GROUPS);
}
