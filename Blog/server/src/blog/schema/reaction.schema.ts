import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { User } from '../../auth/schema/user.schemas';
import { Blog } from './blog.schema';

export type ReactionDocument = HydratedDocument<Reaction>;
export enum React {
    LIKE = "satisfaction",
    FUNNY = "happy",
    SAD = "sad",
    LOVE = "love",
    ANGRY = 'angry',
    SURPRISE ='surprise'
}
@Schema({
    timestamps: true
})

export class Reaction extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Blog" })
    blog: Blog

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    user: User

    @Prop({ required: true })
    reactionType: React
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);