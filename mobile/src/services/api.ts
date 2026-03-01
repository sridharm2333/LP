import { API_BASE_URL, getAuthHeaders } from '../config/api';

type TokenGetter = () => string | null;

let getToken: TokenGetter = () => null;
export function setTokenGetter(fn: TokenGetter) {
  getToken = fn;
}

export async function api<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {}
): Promise<T> {
  const { skipAuth, ...rest } = options;
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const headers = {
    ...getAuthHeaders(skipAuth ? null : getToken()),
    ...(rest.headers as Record<string, string>),
  };
  const res = await fetch(url, { ...rest, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
  return data as T;
}

export const authApi = {
  login: (email: string, password: string) =>
    api<{ token: string; user: { id: string; displayName: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),
  register: (email: string, password: string, displayName: string) =>
    api<{ token: string; user: { id: string; displayName: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
      skipAuth: true,
    }),
};

export const postsApi = {
  getFeed: (params?: { limit?: number; skip?: number }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.skip) q.set('skip', String(params.skip));
    return api<{ posts: Post[] }>(`/posts?${q}`);
  },
  getMyPosts: () => api<{ posts: Post[] }>('/posts/my'),
  getById: (id: string) => api<Post>(`/posts/${id}`),
  create: (body: { content: string; isAnonymous?: boolean; emotionTags?: string[]; moodEmoji?: string }) =>
    api<{ post: Post; groundingMessage?: string }>('/posts', { method: 'POST', body: JSON.stringify(body) }),
};

export const commentsApi = {
  getTemplates: () => api<{ templates: { id: string; text: string }[] }>('/comments/templates'),
  getByPost: (postId: string) => api<{ comments: Comment[] }>(`/comments/post/${postId}`),
  create: (postId: string, body: { content: string; usedTemplateId?: string }) =>
    api<Comment>(`/comments/post/${postId}`, { method: 'POST', body: JSON.stringify(body) }),
  addWarmth: (commentId: string) =>
    api<Comment>(`/comments/${commentId}/warmth`, { method: 'POST' }),
};

export const groupsApi = {
  list: () => api<{ groups: Group[] }>('/groups'),
  join: (groupId: string) => api<{ joined: boolean }>(`/groups/${groupId}/join`, { method: 'POST' }),
  getFeed: (groupId: string) => api<{ posts: GroupPost[] }>(`/groups/${groupId}/feed`),
  createPost: (groupId: string, body: { content: string; isAnonymous?: boolean; emotionTags?: string[] }) =>
    api<GroupPost>(`/groups/${groupId}/posts`, { method: 'POST', body: JSON.stringify(body) }),
};

export const penguinCircleApi = {
  checkDistress: (text: string) =>
    api<{ distressDetected: boolean }>('/penguin-circle/check-distress', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  request: () => api<{ circle: PenguinCircle }>('/penguin-circle/request', { method: 'POST' }),
  my: () => api<{ circle: PenguinCircle | null }>('/penguin-circle/my'),
};

export const userApi = {
  getProfile: () => api<UserProfile>('/user/profile'),
  updateProfile: (body: { displayName?: string; midnightOceanEnabled?: boolean }) =>
    api<UserProfile>('/user/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  companionMessage: () => api<{ message: string }>('/user/companion-message'),
  checkIn: () => api<{ streak: number }>('/user/check-in', { method: 'POST' }),
};

export const reportsApi = {
  create: (body: { targetType: 'post' | 'comment' | 'user'; targetId: string; reason: string }) =>
    api<{ message: string }>('/reports', { method: 'POST', body: JSON.stringify(body) }),
};

export interface Post {
  _id: string;
  content: string;
  isAnonymous?: boolean;
  emotionTags?: string[];
  moodEmoji?: string;
  authorName?: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  warmthCount: number;
  authorId?: { displayName?: string };
  createdAt: string;
}

export interface Group {
  _id: string;
  name: string;
  topic: string;
  description: string;
}

export interface GroupPost extends Post {
  groupId: string;
}

export interface PenguinCircle {
  _id: string;
  userId: string;
  memberIds: string[];
  status: string;
  expiresAt: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  displayName: string;
  kindnessScore: number;
  postingStreakDays: number;
  midnightOceanEnabled: boolean;
}
