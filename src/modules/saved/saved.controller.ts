import {Response, Request} from "express";

import {savedService} from "./saved.service";

export const getSavedPosts = async (req: any, res: Response): Promise<void> => {
  try {
    const savedPosts = await savedService.getSavedPosts(req.user.userId);       
    res.status(200).json({
      success: true,
      data: savedPosts,
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

export const savePost = async (req: any, res: Response): Promise<void> => {         
    try {
        const { postId } = req.params;
        const savedPost = await savedService.savePost(req.user.userId, postId);       
        res.status(200).json({
            success: true,
            data: savedPost,
        });
    }
    catch (error) {
        const message =
            error instanceof Error                ? error.message
                : "Something went wrong";
        res.status(400).json({  
            success: false,
            message,
        });
    }   
};

export const unsavePost = async (req: any, res: Response): Promise<void> => {
    try {
        const { postId } = req.params;
        // console.log("Post ID to unsave:", postId); // Debugging log
        await savedService.unsavePost(req.user.userId, postId);       
        res.status(200).json({
            success: true,
            message: "Post unsaved successfully",
        });
    }   
    catch (error) {
        const message =
            error instanceof Error                ? error.message
                : "Something went wrong";
        res.status(400).json({
            success: false,
            message,
        });
    }   
};