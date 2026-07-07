export type TaskStatus = 'PENDING' | 'DONE';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type TaskPayload = {
  title: string;
  description: string;
};

