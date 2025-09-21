import type {
  MutationCreatePostArgs,
  MutationDeletePostArgs,
  MutationResolvers,
  Post,
} from "../../../generated/graphql";
import posts, { archivePost } from "./data";
import users from "../user/data";

export const postMutations: Pick<
  MutationResolvers,
  "createPost" | "deletePost"
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
};
