import { prisma } from "../../config/database";

interface CreatePostRepositoryDto {
  userId: string;
  title: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE" | "DRAFT";
  imageUrl?: string;
}

export const createPost = async (
  payload: CreatePostRepositoryDto
) => {
  return prisma.posts.create({
    data: {
      user_id: payload.userId,
      title: payload.title,
      description: payload.description,
      visibility: payload.visibility,
      image_url: payload.imageUrl,
    },
  });
};

export const getMyPosts = async (
  userId: string
) => {
  return prisma.posts.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const findPostById = async (
  postId: string
) => {
  return prisma.posts.findUnique({
    where: {
      id: postId,
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          profile_image: true,
        },
      },
    },
  });
};

interface UpdatePostRepositoryDto {
  title?: string;
  description?: string;
  visibility?: "PUBLIC" | "PRIVATE" | "DRAFT";
  imageUrl?: string;
}

export const updatePost = async (
  postId: string,
  payload: UpdatePostRepositoryDto
) => {
  return prisma.posts.update({
    where: {
      id: postId,
    },
    data: {
      title: payload.title,
      description: payload.description,
      visibility: payload.visibility,
      image_url: payload.imageUrl,
    },
  });
};

export const deletePost = async (
  postId: string
) => {
  return prisma.posts.delete({
    where: {
      id: postId,
    },
  });
};