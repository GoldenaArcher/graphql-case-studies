import posts from "../../../../mock/posts.json";
import { orphanCommentsByPostId } from "../comment/data";

export const archivePost = (id: string) => {
  const post = posts.find((post) => post.id === id);
  if (!post) {
    throw new Error("Post not found");
  }

  if (post.archived) {
    throw new Error("Post already archived");
  }

  orphanCommentsByPostId(id);

  post.archived = true;
};

export default posts;
