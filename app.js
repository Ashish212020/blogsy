const express= require('express');
const path = require('path');
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
const cookieParser =require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authentication');
const Blog = require("./models/blog");
const blogRoute = require("./routes/blog");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("Connected to MongoDB");
});

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views', path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./public")));

app.get('/',async (req, res) => {
  const allBlogs = await Blog.find({});
  
  res.render('home', { user:req.user, blogs: allBlogs });
});
app.use("/user", userRouter);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});