const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;

const dbConnectionString = process.env.DB_CONNECTION_STRING.replace(
  '<db_password>',
  process.env.DB_PASSWORD,
);

mongoose
  .connect(dbConnectionString)
  .then(() => {
    console.log('Database connected successfully.');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(() => {
    console.log('Database not connected.');
  });
