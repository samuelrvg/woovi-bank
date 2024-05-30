import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const resolvers = {
  Query: {
    currentUser: async (_, __, { user }) => {
      console.log('user', user)
      if (!user) throw new Error('Not authenticated');
      return await User.findById(user.id);
    },
  },
  Mutation: {
    signUp: async (_, { name, cpf, password }) => {
      const existingUser = await User.findOne({ cpf });
      if (existingUser) throw new Error('CPF already registered');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, cpf, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      return { ...user._doc, token };
    },
    login: async (_, { cpf, password }) => {
      const user = await User.findOne({ cpf });
      if (!user) throw new Error('Invalid CPF or password');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid CPF or password');

      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      return { ...user._doc, token };
    },
    createTransaction: async (_, { receiver, amount }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      const senderAccount = await Account.findOne({ userId: user.id });
      const receiverAccount = await Account.findOne({ accountNumber: receiver });
      if (!receiverAccount) throw new Error('Receiver account not found');

      const transaction = new Transaction({
        sender: senderAccount._id,
        receiver: receiverAccount._id,
        amount,
      });

      senderAccount.balance -= amount;
      receiverAccount.balance += amount;

      await transaction.save();
      await senderAccount.save();
      await receiverAccount.save();

      return transaction;
    },
  },
};