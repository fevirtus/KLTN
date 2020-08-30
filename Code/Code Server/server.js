require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const authMiddleware = require('./middlewares/auth.middleware');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');
const petRoute = require('./routes/pet.route');
const commonRoute = require('./routes/api.route')
const uploadRoute = require('./routes/cloudinary.route')

const PORT = process.env.PORT || 3000;
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use('/images', express.static('upload/images'))

app.use('/api/users', authMiddleware.authentication, userRoute);
app.use('/api/pets', authMiddleware.authentication, petRoute);
app.use('/api/common', authMiddleware.authentication, commonRoute);
app.use('/api', authRoute);
app.use('/cloudinary', uploadRoute);

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
}); 
