import { Blog } from "../../../blog/schema/blog.schema";

export class createCategoryDto {
    readonly blog: Blog
    readonly name: string
}