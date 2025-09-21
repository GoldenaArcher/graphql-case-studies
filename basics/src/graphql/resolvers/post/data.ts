import posts from "../../../../mock/posts.json";
import type { UpdatePostInput } from "../../../generated/graphql";
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

export const updatePost = (id: string, data: UpdatePostInput) => {
  const post = posts.find((post) => post.id === id);
  if (!post) {
    throw new Error("Post not found");
  }

  if (data.title) {
    post.title = data.title;
  }
  if (data.body) {
    post.body = data.body;
  }
  if (typeof data.published === "boolean") {
    post.published = data.published;
  }

  return post;
};

export default posts;
