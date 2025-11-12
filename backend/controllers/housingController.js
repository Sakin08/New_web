import HousingPost from "../models/HousingPost.js";
import { uploadImage } from "../services/cloudinaryService.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export const createHousing = [
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { rent, address, description, roommatesNeeded, phone } = req.body;

      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = await Promise.all(
          req.files.map((file) => uploadImage(file))
        );
      }

      const post = await HousingPost.create({
        rent,
        address,
        description,
        roommatesNeeded,
        phone,
        images: imageUrls,
        user: req.user._id,
      });

      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

export const getHousings = async (req, res) => {
  const posts = await HousingPost.find().populate("user", "name email phone");
  res.json(posts);
};

export const getHousingById = async (req, res) => {
  try {
    const post = await HousingPost.findById(req.params.id).populate(
      "user",
      "name email phone profilePicture"
    );

    if (!post) {
      return res.status(404).json({ message: "Housing post not found" });
    }

    // Increment view count
    post.views = (post.views || 0) + 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHousing = async (req, res) => {
  const post = await HousingPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
};

export const deleteHousing = async (req, res) => {
  const post = await HousingPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  if (post.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  await post.deleteOne();
  res.json({ message: "Deleted" });
};
