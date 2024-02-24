import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Express as Query } from 'express-serve-static-core';
import mongoose, { Model } from 'mongoose';
import { Role, User } from '../../auth/schema/user.schemas';
import { Blog } from '../schema/blog.schema';
import { Comment } from '../schema/comment.schema';
import { createCommentDto } from './dto/create-comment.dto';
import { updateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        @InjectModel(Blog.name) private blogModel: Model<Blog>) { }
    // Find Id by comment
    async findAll(query: Query): Promise<Comment[]> {
        // Case Sensitivity
        const keyword = query.name ? {
            name: {
                $regex: query.name,
                $options: 'i',
            },
        } : {};

        // find comments and exclude confidential information in populate method
        return await this.commentModel.find({ ...keyword }).populate('user', '-password -userStatus -role').populate('replies');
    }

    // Create Comment
    async createComment(id: string, createCommentDto: createCommentDto, user: User): Promise<Comment> {
        const isValidObjectId = mongoose.isValidObjectId(id)
        // Check the id is valid mongoose id
        if (!isValidObjectId) {
            throw new BadRequestException('Object Id is not correct')
        }
        // Get the Blog and check the Blog Id is valid
        const blog = await this.blogModel.findById(id);
        if (!blog) {
            throw new BadRequestException('Please enter correct Blog id')
        }
        // Merge the data in single object
        const data = Object.assign(createCommentDto, { user: user._id }, { blog: id });
        // Create comment
        const createComment = await this.commentModel.create(data)

        // Pass comment id in blog also
        blog.comments.push(createComment._id)
        blog.save();
        return createComment;
    }

    // Update Comment
    async UpdateComment(id: string, updateCommentDto: updateCommentDto, user: User): Promise<Comment> {
        // Using Monoose method to check ObjectId
        const isValidObjectId = mongoose.isValidObjectId(id)
        // Check the id is valid mongoose id
        if (!isValidObjectId) {
            throw new BadRequestException('Object Id is not correct')
        }

        // Check the authorized Comment User for update
        const comment = await this.commentModel.findById(id)
        if (comment.user._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException('Please authorized yourself :)')
        }
        const updateComment = await this.commentModel.findByIdAndUpdate(id, updateCommentDto);
        return updateComment;

    }

    // Delete Comment

    async deleteComment(id: string, user: User): Promise<{ msg: string, deletedComment: Comment }> {

        const isValidObjectId = mongoose.isValidObjectId(id)
        // Check the id is valid mongoose id
        if (!isValidObjectId) {
            throw new BadRequestException('Object Id is not correct')
        }
        // Delete Function Admin Role By Bypassing the comment creator logc
        if (user.role === Role.ISADMIN) {
            const deletedComment = await this.commentModel.findByIdAndDelete(id);
            // Delete the comment in blog also by admin
            const blog = await this.blogModel.findById(deletedComment.blog)
            blog.comments = blog.comments.filter(id => id !== deletedComment._id.toString());
            await blog.save()
            return { msg: "Comment Deleted Successfully by admin", deletedComment };
        }

        // Check user is same which create comment
        const comment = await this.commentModel.findById(id)

        if (comment.user._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException('Please authorized yourself :)')
        }

        // Deleted the comment in blog also by authorized user
        const deletedComment = await this.commentModel.findByIdAndDelete(id)
        // Get the deleted Blog
        const blog = await this.blogModel.findById({ _id: deletedComment.blog.toString() })

        // Update Comments in Blog by filtering the deleted Blog
        blog.comments = blog.comments.filter(commentId => commentId.toString() !== deletedComment._id.toString());
        await blog.save()

        return { msg: 'Comment deleted successfully by user', deletedComment };
    }
}