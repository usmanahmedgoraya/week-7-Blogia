import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import mongoose, { Model } from 'mongoose';
import { Express } from 'express-serve-static-core';
import { User } from '../auth/schema/user.schemas';
import { createBlogDto } from './dto/create-blog.dto';
import { updateBlogDto } from './dto/update-blog.dto';
import { Blog, Status } from './schema/blog.schema';
import { React, Reaction } from './schema/reaction.schema';
import toStream = require('buffer-to-stream');
import { Categories } from './schema/categories.schema';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
        @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
        @InjectModel(Categories.name) private readonly categoriesModel: Model<Categories>,
    ) { }

    // Find Id by query of category
    async findAll(query: Express): Promise<Blog[]> {
        const categoryName: any = query.name;
        console.log(categoryName);

        if (!categoryName) {
            // Handle the case where the category name is not provided.
            // You might want to return an empty array or throw an exception.
            return [];
        }

        const category = await this.categoriesModel.findOne({
            name: { $regex: new RegExp(categoryName, 'i') },
        });

        if (!category) {
            // Handle the case where the category with the given name is not found.
            // You might want to return an empty array or throw an exception.
            return [];
        }

        return await this.blogModel.find({ categories: category._id })
            .populate('categories user')
            .populate({
                path: 'reaction',
                populate: {
                    path: 'user',
                    model: 'User',
                },
            });
    }

    // Get all the Blogs
    async findAllBlogs(): Promise<Blog[]> {
        return await this.blogModel.find().populate('categories user')
            .populate({
                path: 'reaction',
                populate: {
                    path: 'user',
                    model: 'User',
                },
            });
    }

    // Get all the Blogs
    async findAllUserBlog(user: User): Promise<Blog[]> {
        return await this.blogModel.find({ user: user._id }).populate('categories')
    }

    // Get Blog By Id
    async findOne(id: string): Promise<Blog> {
        const isIdValid = mongoose.isValidObjectId(id)
        if (!isIdValid) {
            throw new BadRequestException('Incorrect Object ID')
        }
        const blog = await this.blogModel.findById(id).populate('categories reaction comments').populate('user', '-password').populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User',
                select: '-password'
            },
        })
        return blog

    }

    // Create Blog
    async createBlog(createBlogDto: createBlogDto, user: User, imageUrl: any): Promise<Blog> {
        const data = Object.assign(createBlogDto, { user: user._id, image: imageUrl.data });
        const blog = await this.blogModel.create(data)
        return blog;
    }

    // Update Blog
    async updateBlog(id: string, updateBlogDto: updateBlogDto, user: User): Promise<Blog> {
        const blog = await this.blogModel.findById(id)
        if (blog.user._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException('Please authorized yourself :)')
        }
        const updatedBlog = await this.blogModel.findByIdAndUpdate(id, { ...updateBlogDto, status: "pending" })

        return updatedBlog;
    }

    // Delete Blog
    async deleteBlog(id: string, user: User): Promise<Blog> {
        const isIdValid = mongoose.isValidObjectId(id)
        if (!isIdValid) {
            throw new BadRequestException('Incorrect Object ID')
        }
        const blog = await this.blogModel.findById(id)
        if (!blog) {
            throw new NotFoundException('Not Found')
        }
        if (user.role === "admin") {
            return await this.blogModel.findByIdAndDelete(id)
        }

        if (blog.user._id.toString() !== user._id.toString()) {
            throw new UnauthorizedException('Please authorized yourself :)')
        }
        return await this.blogModel.findByIdAndDelete(id)
    }


    // Approved Blog By Admin
    async approvedBlog(id: string): Promise<Blog> {
        const isIdValid = mongoose.isValidObjectId(id)
        if (!isIdValid) {
            throw new BadRequestException('Incorrect Object ID')
        }

        const blog = await this.blogModel.findById(id)
        if (!blog) {
            throw new NotFoundException('Blog Not Found')
        }

        if (blog.status === "Approved") {
            throw new ConflictException('Blog already approved')
        }
        blog.status = Status.APPROVED
        blog.save()
        return blog;
    }

    // DisApproved Blog By Admin
    async disapprovedBlog(id: string): Promise<Blog> {

        const isIdValid = mongoose.isValidObjectId(id)
        if (!isIdValid) {
            throw new BadRequestException('Incorrect Object ID')
        }

        const blog = await this.blogModel.findById(id)
        if (!blog) {
            throw new NotFoundException('Blog Not Found')
        }
        if (blog.status === "Disapproved") {
            throw new ConflictException('Blog already disapproved')
        }
        blog.status = Status.DISAPPROVE
        blog.save()
        return blog;
    }

    // User Reaction on Blog
    async userBlogReaction(id: string, reactionType: React, user: User): Promise<Reaction> {
        // console.log(user._id,reactionType);

        const reaction = await this.reactionModel.find({ blog: id, user: user._id })
        console.log(reaction);

        if (reaction.length === 0) {
            const newReaction = await this.reactionModel.create({
                blog: id,
                user: user._id,
                reactionType: reactionType
            })
            const blog = await this.blogModel.findById(id)
            blog.reaction.push(newReaction._id)
            await blog.save()
            return newReaction
        };
        if (reaction[0].reactionType === reactionType) {
            const deletedReaction = await this.reactionModel.findByIdAndDelete(reaction[0]._id);
            const blog = await this.blogModel.findById(id)
            blog.reaction = blog.reaction.filter(id => id !== deletedReaction._id.toString());
            await blog.save();
            return deletedReaction;

        }
        const updateReaction = await this.reactionModel.findByIdAndUpdate(reaction[0]._id, { reactionType: reactionType })

        return updateReaction;
    }

    // Upload image
    async uploadImage(
        fileName: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {

        return new Promise((resolve, reject) => {
            v2.config({
                cloud_name: 'dyunqrxki',
                api_key: '314779842884433',
                api_secret: '-i0YvyvBHBBli53Z5jMliLGbf3A',
            });
            console.log('Hello 2');

            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                console.log(result)
                resolve(result);
            });
            toStream(fileName.buffer).pipe(upload);
        });
    }
}
