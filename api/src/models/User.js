import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserModel = mongoose.models.Account || mongoose.model('User', userSchema);

export default UserModel;