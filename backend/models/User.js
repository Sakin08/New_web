import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);