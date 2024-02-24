import { Replies } from "src/blog/schema/Replies.schema";
import { Blog } from "src/blog/schema/blog.schema";

export class updateCommentDto {
    readonly blog: Blog
    readonly replies: Replies
    readonly content: string
}