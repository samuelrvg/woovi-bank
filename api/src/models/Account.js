import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  balance: { type: Number, default: 0 },
});

const AccountModel = mongoose.models.Account || mongoose.model('Account', accountSchema);

export default AccountModel;