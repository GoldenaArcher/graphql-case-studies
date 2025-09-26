import { postLoader } from './post.loader';
import { commentLoader } from './comment.loader';

export function createLoaders() {
    return {
        postLoader: postLoader(),
        commentLoader: commentLoader(),
    };
}