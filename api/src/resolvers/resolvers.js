import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import User from '../models/User.js';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

const JWT_SECRET = config.JWT_SECRET;

export const resolvers = {
  Query: {
    currentUser: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findById(user.id);
    },
  },
  Mutation: {
    signUp: async (_, { name, cpfCnpj, password }) => {
      const existingUser = await User.findOne({ cpfCnpj });
      if (existingUser) throw new Error('CPF/CNPJ already registered');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, cpfCnpj, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      return { ...user._doc, token };
    },
    login: async (_, { cpfCnpj, password }) => {
      const user = await User.findOne({ cpfCnpj });
      if (!user) throw new Error('Invalid CPF/CNPJ or password');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid CPF/CNPJ or password');

      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      return { ...user._doc, token };
    },
    createTransaction: async (_, { receiver, amount }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      //TODO: Resolver Idempotência

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