import { prisma } from "../../config/database";
import * as postRepository from "../posts/posts.repository";
import { post_visibility } from "@prisma/client";

export const getSavedPosts = async (
  userId: string
) => {
  return prisma.saved_posts.findMany({
    where: {
      user_id: userId,
    },

    include: {
      posts: {
        include: {
          users: {
            select: {
              id: true,
              name: true,
              profile_image: true,
            },
          },
        },
      },
    },

    orderBy: {
      created_at: "desc",
    },
  });
};

export const createSavedPost = async (
  userId: string,
  postId: string
) => {
  

const post = await postRepository.findPostById(postId);

  if (!post) {  
    throw new Error(
      "Post not found"
    );
  }


  if (post.visibility === post_visibility.PRIVATE || post.visibility === post_visibility.DRAFT) {
    throw new Error(
      "Cannot save a private or draft post"
    );
  } 

const existingSavedPost = await prisma.saved_posts.findFirst({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });

    if (existingSavedPost) {
    throw new Error(
      "Post is already saved"
    );
  }


  return prisma.saved_posts.create({
    data: {
      user_id: userId,
      post_id: postId,
    },
  });
};

export const unsavePost = async (
  userId: string,
  postId: string
) => {
  return prisma.saved_posts.deleteMany({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });
};  
