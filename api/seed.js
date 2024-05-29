import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';
import Account from './src/models/Account.js';
import Transaction from './src/models/Transaction.js';

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

async function seedDatabase() {
  try {
    await mongoose.connection.dropDatabase();

    const passwordHash = await bcrypt.hash('password123', 10);

    // Criar usuários
    const users = await User.insertMany([
      { name: 'Alice', cpf: '12345678901', password: passwordHash },
      { name: 'Bob', cpf: '09876543210', password: passwordHash },
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