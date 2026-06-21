import * as postRepository from "./posts.repository";
import { uploadImage } from "../../common/utils/uploadImage";

interface CreatePostServiceDto {
  userId: string;
  title: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE" | "DRAFT";
  imageUrl?: string;
}

export const createPost = async (
  payload: CreatePostServiceDto
) => {
 
  console.log("Creating post with payload:", payload);


  const post =
    await postRepository.createPost(
      payload
    );

  return post;
};

export const getMyPosts = async (
  userId: string
) => {

  const posts =
    await postRepository.getMyPosts(
      userId
    );

  return posts.map((post: any)=> ({
    id: post.id,
    title: post.title,
    description: post.description,
    imageUrl: post.image_url,
    visibility: post.visibility,
    createdAt: post.created_at,
  }));
};

export const getPostById = async (
  postId: string,
  currentUserId?: string
) => {

  const post =
    await postRepository.findPostById(
      postId
    );

    console.log("Fetched post:", post);
    console.log(postId)
    console.log(currentUserId)

  if (!post) {
    throw new Error(
      "Post not found"
    );
  }

  const isOwner =
    currentUserId === post.user_id;

  const isPublic =
    post.visibility === "PUBLIC";

  if (!isPublic && !isOwner) {
    throw new Error(
      "You are not allowed to view this post"
    );
  }

  return {
    id: post.id,
    title: post.title,
    description: post.description,
    imageUrl: post.image_url,
    visibility: post.visibility,
    createdAt: post.created_at,

    author: {
      id: post.users.id,
      name: post.users.name,
      profileImage:
        post.users.profile_image,
    },
  };
};

export const updatePost = async (
  postId: string,
  userId: string,
  payload: {
    title?: string;
    description?: string;
    visibility?: "PUBLIC" | "PRIVATE" | "DRAFT";
  },
  file?: Express.Multer.File
) => {

  const post =
    await postRepository.findPostById(
      postId
    );

  if (!post) {
    throw new Error(
      "Post not found"
    );
  }

  if (post.user_id !== userId) {
    throw new Error(
      "You are not allowed to update this post"
    );
  }

  let imageUrl =
    post.image_url ?? undefined;

  if (file) {

    imageUrl =
      await uploadImage(
        file.buffer,
        "blog_posts"
      );

  }

  const updatedPost =
    await postRepository.updatePost(
      postId,
      {
        ...payload,
        imageUrl,
      }
    );

  return updatedPost;
};

export const deletePost = async (
  postId: string,
  userId: string
): Promise<void> => {

  const post =
    await postRepository.findPostById(
      postId
    );

  if (!post) {
    throw new Error(
      "Post not found"
    );
  }

  if (post.user_id !== userId) {
    throw new Error(
      "You are not allowed to delete this post"
    );
  }

  await postRepository.deletePost(
    postId
  );
};