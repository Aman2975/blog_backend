import * as savedRepository from "./saved.repository";

export const savedService = {  
    getSavedPosts: async (userId: string) => {
        const savedPosts = await savedRepository.getSavedPosts(userId);
        return savedPosts.map((post: any) => ({
            id: post.post_id,
            title: post.posts.title,
            description: post.posts.description,
            imageUrl: post.posts.image_url,
            // visibility: post.visibility,
            createdAt: post.created_at,
        }));

        // return savedPosts;
    },

    savePost: async (userId: string, postId: string) => {               
        const savedPost = await savedRepository.createSavedPost(userId, postId);
        // return {
        //     id: savedPost.id,   
        //     title: savedPost.title,
        //     description: savedPost.description,
        //     imageUrl: savedPost.image_url,  
        //     visibility: savedPost.visibility,
        //     createdAt: savedPost.created_at,
        // };
        return {message: "Post saved successfully"};
    },

    unsavePost: async (userId: string, postId: string) => {
        await savedRepository.unsavePost(userId, postId);
        return { data: null, message: "Post unsaved successfully" };
    },
};      
