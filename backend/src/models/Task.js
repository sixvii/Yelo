import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['Work', 'Personal', 'Study', 'Health'], default: 'Personal' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  date: { type: String, required: true },
  time: { type: String, default: '' },
  is_completed: { type: Boolean, default: false },
  time_spent: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
