import comments from "../../../../mock/comments.json";
import type { UpdateCommentInput } from "../../../generated/graphql";

export const orphanCommentsByPostId = (postId: string) => {
  const postComments = comments.filter((comment) => comment.postId === postId);
  postComments.forEach((comment) => {
    comment.orphaned = true;
  });
};

export const archiveComment = (id: string) => {
  const comment = comments.find((comment) => comment.id === id);
  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.archived) {
    throw new Error("Comment already archived");
  }

  comment.archived = true;

  return comment;
};

export const updateComment = (id: string, data: UpdateCommentInput) => {
  const comment = comments.find((comment) => comment.id === id);
  if (!comment) {
    throw new Error("Comment not found");
  }

  if (data.text) {
    comment.text = data.text;
  }

  return comment;
};

export default comments;
