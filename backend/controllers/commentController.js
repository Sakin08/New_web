import Comment from "../models/Comment.js";
import { notifyContentOwner } from "./notificationController.js";

export const createComment = async (req, res) => {
  try {
    const { content, postType, postId, parentComment } = req.body;

    const comment = await Comment.create({
      content,
      author: req.user._id,
      postType,
      postId,
      parentComment,
    });

    await comment.populate("author", "name profilePicture");

    // Get post owner and notify them
    try {
      const postOwner = await getPostOwner(postType, postId);
      if (postOwner && postOwner.toString() !== req.user._id.toString()) {
        await notifyContentOwner(
          postOwner,
          req.user._id,
          "comment",
          `your ${postType}`,
          `/${postType}/${postId}`
        );
      }
    } catch (notifError) {
      console.error("Failed to send comment notification:", notifError);
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get post owner based on post type
async function getPostOwner(postType, postId) {
  try {
    let Model;
    switch (postType) {
      case "event":
        Model = (await import("../models/Event.js")).default;
        break;
      case "housing":
        Model = (await import("../models/Housing.js")).default;
        break;
      case "buysell":
        Model = (await import("../models/BuySell.js")).default;
        break;
      case "job":
        Model = (await import("../models/Job.js")).default;
        break;
      case "food":
        Model = (await import("../models/FoodOrder.js")).default;
        break;
      case "lostfound":
        Model = (await import("../models/LostFound.js")).default;
        break;
      case "studygroup":
        Model = (await import("../models/StudyGroup.js")).default;
        break;
      case "post":
        Model = (await import("../models/Post.js")).default;
        const post = await Model.findById(postId).select("author");
        return post?.author;
      default:
        return null;
    }

    const post = await Model.findById(postId).select("user");
    return post?.user;
  } catch (error) {
    console.error("Error getting post owner:", error);
    return null;
  }
}

export const getComments = async (req, res) => {
  try {
    const { postType, postId } = req.query;

    const comments = await Comment.find({
      postType,
      postId,
      parentComment: null,
    })
      .populate("author", "name profilePicture")
      .populate({
        path: "parentComment",
        populate: { path: "author", select: "name profilePicture" },
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isLiked = comment.likes.includes(req.user._id);

    if (isLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    res.json({ likes: comment.likes.length, isLiked: !isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Allow admin or owner to delete
    const isOwner = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
