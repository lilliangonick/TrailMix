const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express(); // initalizes express app 

const PORT = process.env.PORT || 000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});