import {
  Request,
  Response,
} from "express";

import { uploadImage } from "../../common/utils/uploadImage";

import * as postService from "./posts.service";

export const createPost = async (
  req: any,
  res: Response
): Promise<void> => {
  try {

    let imageUrl: string | undefined;

    if (req.file) {

      imageUrl =
        await uploadImage(
          req.file.buffer,
          "blog_posts"
        );

    }

    const post =
      await postService.createPost({
        userId: req.user.userId,
        title: req.body.title,
        description:
          req.body.description,
        visibility:
          req.body.visibility,
        imageUrl,
      });

    res.status(201).json({
      success: true,
      message:
        "Post created successfully",
      data: post,
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

export const getMyPosts = async (
  req: any,
  res: Response
): Promise<void> => {
  try {

    const posts =
      await postService.getMyPosts(
        req.user.userId
      );

    res.status(200).json({
      success: true,
      data: posts,
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

export const getPostById = async (
  req: any,
  res: Response
): Promise<void> => {
  try {

    const post =
      await postService.getPostById(
        req.params.postId,
        req.user?.userId
      );

    res.status(200).json({
      success: true,
      data: post,
    });

  } catch (error) {

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(404).json({
      success: false,
      message,
    });

  }
};

export const updatePost = async (
  req: any,
  res: Response
): Promise<void> => {
  try {

    const post =
      await postService.updatePost(
        req.params.postId,
        req.user.userId,
        req.body,
        req.file
      );

    res.status(200).json({
      success: true,
      message:
        "Post updated successfully",
      data: post,
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

export const deletePost = async (
  req: any,
  res: Response
): Promise<void> => {
  try {

    await postService.deletePost(
      req.params.postId,
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message:
        "Post deleted successfully",
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