import express, { NextFunction, Request, Response } from "express";
import { items, Item, ItemStatus } from "./items";

export const CreateItem = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { task, status } = req.body;
    if (
      typeof task !== "string" ||
      typeof status !== "string" ||
      !(status in ItemStatus)
    ) {
      res.status(400).json({ message: "No request processed" });
      return;
    }
    const newItem: Item = { task: task, status: status as ItemStatus };
    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

export const GetItems = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};
