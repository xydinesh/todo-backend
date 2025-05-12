import express, { NextFunction, Request, Response } from "express";
import { Item, ItemStatus } from "./items"; // Keep Item and ItemStatus
import { v4 as uuidv4 } from "uuid";
import { Level } from "level";

// Define the path for the database
const dbPath = "./data/todo-db";
const db = new Level<string, Item>(dbPath, { valueEncoding: "json" });

export const CreateItem = async (req: Request, res: Response) => {
  try {
    const { task, status } = req.body;
    if (
      typeof task !== "string" ||
      typeof status !== "string" ||
      !(status in ItemStatus)
    ) {
      res.status(400).json({ message: "Invalid item data" }); // More general error message
      return;
    }

    // Create a unique key for the item (e.g., using a timestamp or UUID)
    // For simplicity, let's use a timestamp with a prefix
    const key = uuidv4();
    const createdAt = new Date().toISOString();
    const newItem: Item = {
      id: key,
      task: task,
      status: status as ItemStatus,
      createdAt: createdAt,
      lastUpdateAt: createdAt,
    };

    // const jsonString = JSON.stringify(newItem);
    await db.put(key, newItem);
    res.status(201).json(newItem); // Respond with the key and the created item
  } catch (error) {
    console.error("Error creating item:", error); // Log the error
    res.status(500).json({ message: "Error creating item" }); // Send a generic error response
  }
};

export const GetItems = async (req: Request, res: Response) => {
  const items: Item[] = [];
  let parsedItem: Item;
  try {
    for await (const [key, value] of db.iterator()) {
      // parsedItem = JSON.parse(value);
      items.push(value);
    }
    res.status(200).json(items);
  } catch (error) {
    console.error("Error setting up read stream:", error); // Log the error
    res.status(500).json({ message: "Error retrieving items" }); // Send generic error response
  }
};

export const GetItemById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ message: `Bad Request, Invalid Id` });
    return;
  }
  const value = await db.get(id);
  if (!value) {
    res.status(404).json({ message: `Item not found with ${id}` });
    return;
  }
  res.status(200).json(value);
};

export const DeleteItemByID = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: `Bad Request, Invalid Id` });
      return;
    }
    const check = await db.has(id);
    if (check) {
      const value = await db.del(id);
      res.status(200).json({ message: `item with ${id} deleted` });
    } else {
      res.status(404).json({ message: `item ${id} not found in the database` });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error occured when deleting item ${err}` });
    return;
  }
};

export const UpdateItemById = async (req: Request, res: Response) => {
  try {
    const { task, status } = req.body;
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ message: `Bad Request, Invalid Id` });
      return;
    }
    const value = await db.get(id);
    if (!value) {
      res.status(404).json({ message: `Item not found with ${id}` });
      return;
    }
    let updatedItem: Item = { ...value };
    let changesMade: boolean = false;
    if (task !== undefined) {
      if (typeof task === "string" && task.trim().length > 0) {
        updatedItem.task = task;
        changesMade = true;
      } else {
        res.status(400).json({ message: "Invalid task provided" });
        return;
      }
    }

    if (status !== undefined) {
      if (typeof status === "string" && status in ItemStatus) {
        updatedItem.status = status as ItemStatus;
        changesMade = true;
      } else {
        res.status(400).json({ message: "Invalid status provided" });
        return;
      }
    }

    if (!changesMade) {
      res.status(200).json(value);
      return;
    }

    updatedItem.lastUpdateAt = new Date().toISOString();
    await db.put(id, updatedItem);
    res.status(200).json(updatedItem);
  } catch (error: any) {
    console.error(`Error updating item: ${error}`);
    res.status(500).json({ message: "Error updating item" });
  }
};
