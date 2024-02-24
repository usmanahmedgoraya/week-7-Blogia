import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Express} from 'express-serve-static-core';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { Role } from '../../auth/schema/user.schemas';
import { BlogService } from '../blog.service';
import { blogReactionDto } from '../dto/reactionBlogDto.dto';
import { Reaction } from '../schema/Reaction.schema';
import { ReactionService } from './reaction.service';

@Controller('reactions')
export class ReactionController {
    constructor(private Reactionservice: ReactionService, private blogService: BlogService) { }

    // Find Reactions
    @Get()
    async findAllReaction(@Query() query: Express): Promise<Reaction[]> {
        return await this.Reactionservice.findAll(query);
    }


    // create and update and Delete reaction on Blog
    @Post(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async userReactionBlog(@Param('id') id: string, @Body() reaction: blogReactionDto, @Req() req: any): Promise<Reaction> {
        const { type } = reaction
        const blog = await this.blogService.userBlogReaction(id, type, req.user);
        return blog
    }
}
