import comments from "../../../../mock/comments.json";

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
};

export default comments;
