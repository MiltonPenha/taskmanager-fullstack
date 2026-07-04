export type TaskStatus = "pending" | "done";

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
  status?: TaskStatus;
};

export type TaskFilters = {
  status?: TaskStatus | "all";
  search?: string;
};

