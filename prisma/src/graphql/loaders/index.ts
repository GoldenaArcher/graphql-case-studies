import { postByCommentLoader, postByUserLoader } from './post.loader';
import { commentByPostLoader, commentByUserLoader } from './comment.loader';
import { userByCommentLoader, userByPostLoader } from './user.loader';

export function createLoaders() {
    return {
        postByUserLoader: postByUserLoader(),
        postByCommentLoader: postByCommentLoader(),

        commentByUserLoader: commentByUserLoader(),
        commentByPostLoader: commentByPostLoader(),
        
        userByPostLoader: userByPostLoader(),
        userByCommentLoader: userByCommentLoader(),
    };
}