import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from './models/user.js'

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/read', async (req, res) => {
    let users = await User.find()
    res.render("read", {users});;
});

app.get('/delete/:id', async (req, res) => {
    let users = await User.findOneAndDelete({_id: req.params.id})
    res.redirect("/read");
});

app.get('/edit/:userid', async (req, res) => {
    let user = await User.findOne({_id: req.params.userid})
    res.render("edit", {user});
});

app.post('/create', async (req, res) => {
    let {name, email, image} = req.body;
    let createdUser = await User.create({
        name,
        email, 
        image
    });
    res.redirect('/read');
});

app.post('/update/:userid', async (req, res) => {
    let {name, email, image} = req.body;
    let user = await User.findOneAndUpdate({_id: req.params.userid}, {name, email, image});
    res.redirect("/read");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});