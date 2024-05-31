import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
});

const TransactionModel = mongoose.models.Account || mongoose.model('Transaction', transactionSchema);

export default TransactionModel;