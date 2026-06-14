// src\common\utils\uploadImage.ts
import cloudinary from "../../config/cloudinary";

export const uploadImage = (
  fileBuffer: Buffer,
  folder: string = "blog_posts"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,             // organizes images in cloudinary
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
            return;
          }
          resolve(result.secure_url); // ← this is the URL you store in DB
        }
      )
      .end(fileBuffer); // send file buffer to cloudinary
  });
};