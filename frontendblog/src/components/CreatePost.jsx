import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, Quote, Code, Hash, X } from 'lucide-react';
import { createPost } from '../api/post';
import Loader from '../spinner/Loader';
import Header from './Header';
// import Breadcrumbs from './BreadCrumbs';

const CreatePost = () => {
    const [post, setPost] = useState({
        title: '',
        content: '',
        tags: []
    });
    const [loading, setloading] = useState(false);
    const [newTag, setNewTag] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setloading(true);
            const response = await createPost(post.title, post.content, post.tags);
            if (response) {
                alert('Post added successfully!');
                setPost({ title: '', content: '', tags: [] });
            }
        } catch (error) {
            console.error('Error adding post:', error);
            alert('An error occurred while adding the post.');
        } finally {
            setloading(false);
        }
    };

    const applyFormat = (formatType) => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = post.content.substring(start, end);
        
        let prefix, suffix;
        switch (formatType) {
            case 'bold': prefix = '**'; suffix = '**'; break;
            case 'italic': prefix = '_'; suffix = '_'; break;
            case 'underline': prefix = '__'; suffix = '__'; break;
            case 'quote': prefix = '> '; suffix = ''; break;
            case 'code': prefix = '`'; suffix = '`'; break;
            default: return;
        }

        const isFormatted = selectedText.startsWith(prefix) && selectedText.endsWith(suffix);
        const formattedText = isFormatted
            ? selectedText.slice(prefix.length, -suffix.length)
            : `${prefix}${selectedText}${suffix}`;

        const newContent = 
            post.content.substring(0, start) +
            formattedText +
            post.content.substring(end);

        setPost(prev => ({ ...prev, content: newContent }));
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
        }, 0);
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

    const FormatButton = ({ onClick, title, icon: Icon }) => (
        <button
            type="button"
            onClick={onClick}
            className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            title={title}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            {/* <Breadcrumbs /> */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                        <h2 className="text-2xl font-bold text-white text-center">Create New Post</h2>
                    </div>
                    
                    <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                required
                                value={post.title}
                                onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter post title..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Content</label>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="flex items-center gap-1 bg-gray-50 p-2 border-b border-gray-200">
                                    <FormatButton onClick={() => applyFormat('bold')} title="Bold" icon={Bold} />
                                    <FormatButton onClick={() => applyFormat('italic')} title="Italic" icon={Italic} />
                                    <FormatButton onClick={() => applyFormat('underline')} title="Underline" icon={Underline} />
                                    <div className="h-6 w-px bg-gray-300 mx-1" />
                                    <FormatButton onClick={() => applyFormat('quote')} title="Quote" icon={Quote} />
                                    <FormatButton onClick={() => applyFormat('code')} title="Code" icon={Code} />
                                </div>
                                <textarea
                                    ref={textareaRef}
                                    required
                                    value={post.content}
                                    onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
                                    className="w-full px-4 py-3 h-48 focus:ring-0 border-0 resize-none"
                                    placeholder="Write your post content..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tags</label>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 relative">
                                    <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        placeholder="Add tags..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    Add
                                </button>
                            </div>
                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {post.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-2 text-blue-400 hover:text-blue-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                                     hover:from-blue-600 hover:to-blue-700 transition duration-200 
                                     disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                                     flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 mr-2" />
                                    Creating Post...
                                </>
                            ) : 'Create Post'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;