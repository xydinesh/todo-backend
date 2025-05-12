import express, { NextFunction, Request, Response } from "express";
import { Item, ItemStatus } from "./items"; // Keep Item and ItemStatus
import { v4 as uuidv4 } from "uuid";

// Import LevelDB - Revert to original import style
import { Level } from "level";

// Define the path for the database
const dbPath = "./data/todo-db";

// Initialize the LevelDB database - Revert to original instantiation style
const db = new Level(dbPath, { valueEncoding: "json" }); // Revert instantiation

export const CreateItem = async (req: Request, res: Response) => {
  // Removed next: NextFunction
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
    };

    const jsonString = JSON.stringify(newItem);
    await db.put(key, jsonString);
    res.status(201).json(newItem); // Respond with the key and the created item
  } catch (error) {
    console.error("Error creating item:", error); // Log the error
    res.status(500).json({ message: "Error creating item" }); // Send a generic error response
  }
};

export const GetItems = async (req: Request, res: Response) => {
  // Removed next: NextFunction
  const items: Item[] = [];
  let parsedItem: Item;
  try {
    for await (const [key, value] of db.iterator()) {
      parsedItem = JSON.parse(value);
      items.push(parsedItem);
    }
    res.status(200).json(items);
  } catch (error) {
    console.error("Error setting up read stream:", error); // Log the error
    res.status(500).json({ message: "Error retrieving items" }); // Send generic error response
  }
};
