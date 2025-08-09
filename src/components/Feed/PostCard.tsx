import React from 'react';
import { Heart, MessageCircle, Share2, MapPin, Crown, Sparkles, Zap, TrendingUp } from 'lucide-react';
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
    <div className="card overflow-hidden animate-slide-up group">
      {post.isPromoted && (
        <div className="hero-gradient text-white px-4 py-2 flex items-center space-x-2">
          <Crown size={16} className="animate-bounce-subtle" />
          <span className="text-sm font-bold">Promoted Post</span>
          <Sparkles size={14} className="animate-pulse" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={post.userAvatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'}
            alt={post.userName}
            className="w-12 h-12 rounded-full object-cover border-2 border-primary-400/50 shadow-glow"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-white font-display">{post.userName}</h4>
              <span className="text-xs bg-gradient-to-r from-primary-500/30 to-secondary-500/30 text-primary-300 px-2 py-1 rounded-full border border-primary-500/30">
                {post.category}
              </span>
            </div>
            <div className="flex items-center text-sm text-white/60">
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.location && (
                <>
                  <span className="mx-1">•</span>
                  <MapPin size={12} className="mr-1 text-primary-400" />
                  <span>{post.location}</span>
                </>
              )}
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <TrendingUp size={16} className="text-white/60 hover:text-white" />
          </button>
        </div>
        
        <p className="text-white/90 mb-3 leading-relaxed">{post.content}</p>
        
        {post.images && post.images.length > 0 && (
          <div className="mb-3 rounded-xl overflow-hidden relative group">
            <img
              src={post.images[0]}
              alt="Post content"
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-3 right-3 glass rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Zap size={16} className="text-white" />
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            onClick={onLike}
            className="flex items-center space-x-2 text-white/60 hover:text-red-400 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-red-500/10"
          >
            <Heart size={18} className="hover:animate-pulse" />
            <span className="text-sm">{post.likes}</span>
          </button>
          
          <button
            onClick={onComment}
            className="flex items-center space-x-2 text-white/60 hover:text-blue-400 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-blue-500/10"
          >
            <MessageCircle size={18} className="hover:animate-bounce-subtle" />
            <span className="text-sm">{post.comments}</span>
          </button>
          
          <button
            onClick={onShare}
            className="flex items-center space-x-2 text-white/60 hover:text-green-400 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-green-500/10"
          >
            <Share2 size={18} className="hover:animate-pulse" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;