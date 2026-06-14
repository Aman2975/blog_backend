export interface CreatePostDto {
  title: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE" | "DRAFT";
}