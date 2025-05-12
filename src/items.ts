export enum ItemStatus {
  New = "New",
  InProgress = "InProgress",
  Waiting = "Waiting",
  Completed = "Completed",
}

export interface Item {
  task: string;
  status: ItemStatus; // Use the enum type here
}

export let items: Item[] = [];
