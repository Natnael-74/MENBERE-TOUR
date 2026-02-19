import '../../config/env.js';
import fs from 'fs';
import mongoose from 'mongoose';
import Tour from '../../models/tourModel.js';
import User from '../../models/userModel.js';
import Review from '../../models/reviewModel.js';
import directory from '../../utils/directory.js';

const __dirname = directory;

// Load JSON data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`, 'utf-8'),
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8'),
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/reviews.json`, 'utf-8'),
);

// Connect to DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('Database connection successful!');
  } catch (err) {
    console.error('Database connection error:', err.message);
  }
};

// Import data
const importData = async () => {
  try {
    await Tour.create(tours);

    // Use bulkWrite to bypass all Mongoose validation and middleware
    // This preserves the already-hashed passwords from the JSON
    const userOperations = users.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: user },
        upsert: true,
      },
    }));
    await User.bulkWrite(userOperations, { ordered: false });

    await Review.create(reviews);
    console.log('Data imported successfully!');
  } catch (err) {
    console.error('Error importing data:', err.message);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted successfully!');
  } catch (err) {
    console.error('Error deleting data:', err.message);
  }
};

// Execute based on CLI argument
const run = async () => {
  await connectDB();

  if (process.argv[2] === '--import') {
    await importData();
  } else if (process.argv[2] === '--delete') {
    await deleteData();
  } else {
    console.log("Please provide '--import' or '--delete'");
  }

  console.log('Database disconnected');

  // Exit immediately without explicit disconnect
  // This avoids Node.js 24+ / Mongoose async cleanup race condition
  process.exit(0);
};

run();
