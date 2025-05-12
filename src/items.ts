export enum ItemStatus {
  New = "New",
  InProgress = "InProgress",
  Waiting = "Waiting",
  Completed = "Completed",
}

export interface Item {
  id: string;
  task: string;
  status: ItemStatus;
  completed?: boolean;
  createdAt?: string;
}

export let items: Item[] = [];
