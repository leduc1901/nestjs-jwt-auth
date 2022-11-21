import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
});

export interface User {
  _id: string;
  username: string;
  password: string;
  avatar?: string;
}
