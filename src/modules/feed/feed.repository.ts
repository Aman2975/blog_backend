import { prisma } from "../../config/database";

export const getFeedPosts = async (
  skip: number,
  limit: number
) => {
  return prisma.posts.findMany({
    where: {
      visibility: "PUBLIC",
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

    orderBy: {
      created_at: "desc",
    },

    skip,
    take: limit,
  });
};

export const countFeedPosts = async () => {
  return prisma.posts.count({
    where: {
      visibility: "PUBLIC",
    },
  });
};

export const searchPosts = async (
  query: string,
  skip: number,
  limit: number
) => {
  return prisma.posts.findMany({
    where: {
      visibility: "PUBLIC",

      title: {
        contains: query,
        mode: "insensitive",
      },
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

    orderBy: {
      created_at: "desc",
    },

    skip,
    take: limit,
  });
};

export const countSearchPosts = async (
  query: string
) => {
  return prisma.posts.count({
    where: {
      visibility: "PUBLIC",

      title: {
        contains: query,
        mode: "insensitive",
      },
    },
  });
};