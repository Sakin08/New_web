import User from "../models/User.js";
import Review from "../models/Review.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name profilePicture")
      .populate("following", "name profilePicture");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's reviews
    const reviews = await Review.find({ reviewee: user._id })
      .populate("reviewer", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ user, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { bio, interests, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { bio, interests, phone },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Follow user
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      isFollowing: !isFollowing,
      followersCount: userToFollow.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create review
export const createReview = async (req, res) => {
  try {
    const { revieweeId, rating, comment, transactionType, relatedItem } =
      req.body;

    if (revieweeId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot review yourself" });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating,
      comment,
      transactionType,
      relatedItem,
    });

    // Update reviewee's rating
    const reviews = await Review.find({ reviewee: revieweeId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      rating: avgRating,
      reviewCount: reviews.length,
    });

    await review.populate("reviewer", "name profilePicture");
    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You already reviewed this transaction" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get user reviews
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id })
      .populate("reviewer", "name profilePicture")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
