import type {
  MutationCreatePostArgs,
  MutationResolvers,
  Post,
} from "../../../generated/graphql";
import posts from "./data";
import users from "../user/data";

export const postMutations: Pick<MutationResolvers, "createPost"> = {
  createPost: (_parent, { data }: MutationCreatePostArgs) => {
    const userExists = users.some((user) => user.id === data.author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const newPost = {
      id: crypto.randomUUID(),
      ...data,
    };
    posts.push(newPost);
    return newPost as unknown as Post;
  },
};
