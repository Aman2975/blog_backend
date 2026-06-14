import * as feedRepository from "./feed.repository";

export const getFeedPosts = async (
  page: number,
  limit: number
) => {

  const skip =
    (page - 1) * limit;

  const posts =
    await feedRepository.getFeedPosts(
      skip,
      limit
    );

  const totalPosts =
    await feedRepository.countFeedPosts();

  return {
    posts: posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.image_url,
      createdAt: post.created_at,

      author: {
        id: post.users.id,
        name: post.users.name,
        profileImage:
          post.users.profile_image,
      },
    })),

    pagination: {
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(
        totalPosts / limit
      ),
    },
  };
};

export const searchPosts = async (
  query: string,
  page: number,
  limit: number
) => {

  const skip =
    (page - 1) * limit;

  const posts =
    await feedRepository.searchPosts(
      query,
      skip,
      limit
    );

  const totalPosts =
    await feedRepository.countSearchPosts(
      query
    );

  return {
    posts: posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.image_url,
      createdAt: post.created_at,

      author: {
        id: post.users.id,
        name: post.users.name,
        profileImage:
          post.users.profile_image,
      },
    })),

    pagination: {
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(
        totalPosts / limit
      ),
    },
  };
};