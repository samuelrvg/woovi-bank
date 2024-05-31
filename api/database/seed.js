import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';
import Account from '../src/models/Account.js';
import Transaction from '../src/models/Transaction.js';

mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'woovi_bank'
});

async function seedDatabase() {
  try {
    await mongoose.connection.dropDatabase();

    const passwordHash = await bcrypt.hash('woovi#123', 10);

    // Criar usuários
    const users = await User.insertMany([
      { name: 'Alice', cpf: '77005712013', password: passwordHash },
      { name: 'Bob', cpf: '59091028009', password: passwordHash },
      { name: 'Renan', cpf: '16133910054', password: passwordHash },
    ]);

    // Criar contas
    const accounts = await Account.insertMany([
      { accountNumber: '0001', userId: users[0]._id, balance: 1000 },
      { accountNumber: '0002', userId: users[1]._id, balance: 2000 },
    ]);

    // Criar transações
    await Transaction.insertMany([
      { sender: accounts[0]._id, receiver: accounts[1]._id, amount: 100 },
      { sender: accounts[1]._id, receiver: accounts[0]._id, amount: 200 },
    ]);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();