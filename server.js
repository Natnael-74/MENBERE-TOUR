const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

const dbConnectionString = process.env.DB_CONNECTION_STRING.replace(
  '<db_password>',
  process.env.DB_PASSWORD
);

mongoose
  .connect(dbConnectionString)
  .then(() => {
    console.log('Database connected succesfully.');
  })
  .catch(() => {
    console.log('Database not connected.');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
