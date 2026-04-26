export const likeCommentMessages = {
  SUCCESS: {
    LIKE_ADDED: "Like added successfully",
    LIKE_REMOVED: "Like removed successfully",
    COMMENT_ADDED: "Comment added successfully",
    COMMENT_DELETED: "Comment deleted successfully",
    COMMENTS_FETCHED: "Comments fetched successfully",
    REPLIES_FETCHED: "Replies fetched successfully",
    LIKED_USERS_FETCHED: "Liked users fetched successfully",
  },

  ERROR: {
    Comment_NOT_FOUND: "Comment not found",
    POST_OR_BEAUTICIAN_REQUIRED: "Either postId or beauticianId is required", 
    ONLY_ONE_ALLOWED: "Only one of postId or beauticianId is allowed",        
    LIKE_NOT_FOUND:'Like not found',                                  
    RATING_REQUIRED: "Rating (1–5) is required for home service reviews",     
    PARENT_COMMENT_NOT_FOUND: "Parent comment not found",                     
    INVALID_REPLY: "Invalid reply: mismatched parent",  
    POST_ALREDY_LIKED:'Post already liked'                      
  },
};