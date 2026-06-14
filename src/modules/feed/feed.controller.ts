import {
  Request,
  Response,
} from "express";

import * as feedService from "./feed.service";

export const getFeedPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const result =
      await feedService.getFeedPosts(
        page,
        limit
      );

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });

  }
};

export const searchPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const query =
      String(req.query.query || "");

    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    if (!query.trim()) {
      res.status(400).json({
        success: false,
        message:
          "Search query is required",
      });

      return;
    }

    const result =
      await feedService.searchPosts(
        query,
        page,
        limit
      );

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });

  }
};