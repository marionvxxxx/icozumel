import React from 'react';
import { Heart, MessageCircle, Share2, MapPin, Crown } from 'lucide-react';
import { Post } from '../../types';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {post.isPromoted && (
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 flex items-center space-x-2">
          <Crown size={16} />
          <span className="text-sm font-medium">Promoted Post</span>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={post.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'}
            alt={post.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{post.userName}</h4>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin size={12} className="mr-1" />
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-gray-900 mb-3">{post.content}</p>
        
        {post.images && post.images.length > 0 && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={post.images[0]}
              alt="Post content"
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={onLike}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <Heart size={18} />
            <span className="text-sm">{post.likes}</span>
          </button>
          
          <button
            onClick={onComment}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={18} />
            <span className="text-sm">{post.comments}</span>
          </button>
          
          <button
            onClick={onShare}
            className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
          >
            <Share2 size={18} />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;