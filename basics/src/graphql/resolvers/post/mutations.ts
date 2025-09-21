import type {
  MutationCreatePostArgs,
  MutationDeletePostArgs,
  MutationResolvers,
  MutationUpdatePostArgs,
  Post,
} from "../../../generated/graphql";
import posts, { archivePost, updatePost } from "./data";
import users from "../user/data";

export const postMutations: Pick<
  MutationResolvers,
  "createPost" | "deletePost" | "updatePost"
> = {
  createPost: (_parent, { data }: MutationCreatePostArgs) => {
    const userExists = users.some((user) => user.id === data.author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const newPost = {
      id: crypto.randomUUID(),
      ...data,
    };
    posts.push({ ...newPost, archived: false });
    return newPost as unknown as Post;
  },
  deletePost: (_parent, { id }: MutationDeletePostArgs) => {
    archivePost(id);
    return true;
  },
  updatePost: (_parent, { id, data }: MutationUpdatePostArgs) => {
    return updatePost(id, data) as unknown as Post;
  },
};
