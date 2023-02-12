import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation, postCreateValidation } from "./validations.js";


import { PostController, UserController } from './controllers/index.js'
import { handleValidationErrors, checkAuth} from './utils/index.js';

mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.r9menhe.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err));

const app = express();

mongoose.set("strictQuery", false);

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})

app.get('/post', PostController.getAll);
app.get('/post/:id', PostController.getOne);
app.post('/post', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/post/:id', checkAuth, PostController.remove);
app.patch('/post/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');

});