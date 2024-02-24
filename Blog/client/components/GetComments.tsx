'use client'

import useBlogStore from '@/zustand/useBlogStore';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';

// Interface for comment object
interface IComment {
    _id: string;
    content: string;
    blog: string;
    createdAt: string;
    user: {
        _id: string;
        name: string;
        profileImage: string;
    };
    onEdit: (commentId: string, updatedContent: string) => void;
}

// Individual Comment Card component
const CommentCard: React.FC<{ comment: IComment, blogId: string }> = ({ comment, blogId }) => {
    const [blogIds, setBlogId] = useState("");
    const { singleBlog } = useBlogStore()
    useEffect(() => {
        setBlogId(singleBlog._id);
    }, []);
    
    // Retrieve updateComment and deleteComment methods from useBlogStore hook
    const { updateComment, deleteComment } = useBlogStore();

    // Retrieve user authentication data from local storage
    const Auth: any = localStorage.getItem('Auth');
    const userAuth: any = JSON.parse(Auth);

    // Function to handle comment deletion
    const handleDelete = () => {
        deleteComment(comment._id, blogIds);
    }

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedContent, setEditedContent] = useState<any>(comment.content);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        console.log('handle Savew',blogIds);
        
        updateComment(comment._id, blogIds, editedContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedContent(comment.content);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedContent(e.target.value);
    };

    // Function to format comment creation date
    const formatDate = (): string => {
        const dateString = comment.createdAt;
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        return formattedDate;
    }

    return (
        <div className="chat chat-start relative mt-6 w-full md:w-96">
            {/* Display user profile image */}
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="User profile" src={comment.user.profileImage || "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                </div>
            </div>
            {/* Display user name and comment creation date */}
            <div className="chat-header flex justify-between w-full absolute -top-6 items-center">
                <span>{comment.user.name}</span>
                <time className="text-xs opacity-50 mr-6 md:mr-0">{formatDate()}</time>
            </div>
            {/* Display comment content */}
            {isEditing ? (
                <textarea
                    className="chat-bubble w-full md:w-96"
                    value={editedContent}
                    onChange={handleContentChange}
                />
            ) : (
                <div className="chat-bubble w-full md:w-96">{comment.content}</div>
            )}
            <div className="chat-footer opacity-50 w-full flex justify-end absolute mt-2">
                {comment?.user?._id === userAuth?.state?.user?._id && (
                    <div className='flex space-x-2'>
                        {isEditing ? (
                            <>
                                <span className='cursor-pointer text-green-500' onClick={handleSave}>
                                    Save
                                </span>
                                <span className='cursor-pointer text-red-500' onClick={handleCancel}>
                                    Cancel
                                </span>
                            </>
                        ) : (
                            <>
                                <span onClick={handleEdit} className='cursor-pointer hover:text-green-500'>
                                    <PencilSquareIcon className='w-4 h-4' />
                                </span>
                                <span onClick={handleDelete} className='cursor-pointer hover:text-red-500'>
                                    <TrashIcon className='w-4 h-4' />
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Component to fetch and display comments for a blog
const GetComments: React.FC<{ comments: IComment[], blogId: string }> = ({ comments, blogId }) => {
    

    return (
        <div>
            <h1 className='text-2xl font-bold mt-7'>Comments</h1>
            <div className='flex flex-col gap-y-10 mt-6'>
                {/* Map through comments and render CommentCard for each comment */}
                {comments.map((comment: any, index) => (
                    <CommentCard key={comment._id} comment={comment} blogId={''} />
                ))}
            </div>
        </div>
    );
};

export default GetComments;
