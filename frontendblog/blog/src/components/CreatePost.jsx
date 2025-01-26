import React, { useState } from 'react';

import { Bold, Italic, Underline, List, ListOrdered, Link, Quote, Code } from 'lucide-react';
import { createPost } from '../api/post';
import Loader from '../spinner/Loader';
import Header from './Header';

const CreatePost = () => {
    const [post, setPost] = useState({
        title: '',
        content: '',
        tags: []
    });
    const [loading, setloading] = useState(false);
    const [newTag, setNewTag] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setloading(true);
            const response = await createPost(post.title, post.content, post.tags);
            if (response) {
                alert('Post added successfully!');
                setPost({
                    title: '',
                    content: '',
                    tags: []
                });
            }
        } catch (error) {
            console.error('Error adding post:', error);
            alert('An error occurred while adding the post.');
        } finally {
            setloading(false);
        }
    };

    const applyFormat = (formatType) => {
        const textarea = document.getElementById('content-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = post.content.substring(start, end);

        let formattedText = selectedText;
        switch (formatType) {
            case 'bold':
                formattedText = selectedText.startsWith('**') && selectedText.endsWith('**')
                    ? selectedText.slice(2, -2)
                    : `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = selectedText.startsWith('*') && selectedText.endsWith('*')
                    ? selectedText.slice(1, -1)
                    : `*${selectedText}*`;
                break;
            case 'underline':
                formattedText = selectedText.startsWith('<u>') && selectedText.endsWith('</u>')
                    ? selectedText.slice(3, -4)
                    : `<u>${selectedText}</u>`;
                break;
            case 'quote':
                formattedText = selectedText.startsWith('> ')
                    ? selectedText.slice(2)
                    : `> ${selectedText}`;
                break;
            case 'code':
                formattedText = selectedText.startsWith('`') && selectedText.endsWith('`')
                    ? selectedText.slice(1, -1)
                    : `\`${selectedText}\``;
                break;
        }

        const newContent =
            post.content.substring(0, start) +
            formattedText +
            post.content.substring(end);

        setPost(prev => ({ ...prev, content: newContent }));
        textarea.focus();
    };

    const addTag = () => {
        if (newTag && !post.tags.includes(newTag)) {
            setPost(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setPost(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    return (
        <div>
            <Header/>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Loader />
                </div>
            )}
            <h2 className="text-2xl font-bold mb-6 text-center">Add a New Post</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Post title:</label>
                    <input
                        type="text"
                        required
                        value={post.title}
                        onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Post content:</label>
                    <div className="flex space-x-2 mb-2 bg-gray-100 p-2 rounded-md">
                        <button
                            type="button"
                            onClick={() => applyFormat('bold')}
                            className="hover:bg-gray-200 p-2 rounded"
                            title="Bold"
                        >
                            <Bold size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => applyFormat('italic')}
                            className="hover:bg-gray-200 p-2 rounded"
                            title="Italic"
                        >
                            <Italic size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => applyFormat('underline')}
                            className="hover:bg-gray-200 p-2 rounded"
                            title="Underline"
                        >
                            <Underline size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => applyFormat('quote')}
                            className="hover:bg-gray-200 p-2 rounded"
                            title="Quote"
                        >
                            <Quote size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => applyFormat('code')}
                            className="hover:bg-gray-200 p-2 rounded"
                            title="Code"
                        >
                            <Code size={20} />
                        </button>
                    </div>
                    <textarea
                        id="content-textarea"
                        required
                        value={post.content}
                        onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                        placeholder="Write your post content..."
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags:</label>
                    <div className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Add a tag"
                            className="flex-grow px-2 py-1 border border-gray-300 rounded-md"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md"
                        >
                            Add Tag
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span
                                key={tag}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                            >
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="pt-4">
                    {!loading ? (
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Add Post
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full bg-gray-400 text-white py-2 rounded-md cursor-not-allowed"
                        >
                            Adding Post...
                        </button>
                    )}
                </div>
            </form>
        </div>
        </div>
    );
}

export default CreatePost;