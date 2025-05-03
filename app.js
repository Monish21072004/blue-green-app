const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const COLOR = process.env.COLOR || 'blue';

app.get('/', (req, res) => res.send(`Hello from the ${COLOR} version!`));

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
