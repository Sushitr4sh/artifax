if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

/* Express */
const express = require("express");
const app = express();
const port = 8080;

/* AWS-SDK */
const {
  InvokeCommand,
  LambdaClient,
  LogType,
} = require("@aws-sdk/client-lambda");
const {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
} = require("@aws-sdk/client-s3");

const clientAccess = {
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

async function invokeLambda(prompt) {
  const client = new LambdaClient(clientAccess);

  const command = new InvokeCommand({
    FunctionName: "access-bedrock-fm-1",
    Payload: JSON.stringify({
      data: prompt,
    }),
    LogType: LogType.Tail,
  });

  const { Payload, LogResult } = await client.send(command);
  let result = Buffer.from(Payload).toString();
  return result;
}

async function deleteObject(fileName) {
  const client = new S3Client(clientAccess);

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  });

  try {
    await client.send(command);
  } catch (err) {
    return new ExpressError(
      500,
      "Internal Server Error",
      "An error occurred when attempting to delete an image, resulting in an internal server issue. Please ensure that your network connection is functioning properly",
    );
  }
}

async function deleteMultipleObject(fileNames) {
  const client = new S3Client(clientAccess);

  const command = new DeleteObjectsCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Delete: {
      Objects: fileNames,
    },
  });

  try {
    await client.send(command);
  } catch (err) {
    return new ExpressError(
      500,
      "Internal Server Error",
      "An error occurred when attempting to delete an image, resulting in an internal server issue. Please ensure that your network connection is functioning properly",
    );
  }
}

/* Mongoose */
const mongoose = require("mongoose");

const methodOverride = require("method-override");

const helmet = require("helmet");

const path = require("path");

const moment = require("moment");

/* Mongoose Models */
const User = require("./models/user");
const Chat = require("./models/chat");
const Prompt = require("./models/prompt");

/* EJS */
const ejsMate = require("ejs-mate");

/* Error Handlling */
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");

/* Cookies, Session, and Flash */
const session = require("express-session");
const flash = require("connect-flash");

/* Connect Mongo */
const MongoStore = require("connect-mongo");

/* Passport */
const passport = require("passport");
const LocalStrategy = require("passport-local");

/* mongoSanitize*/
const mongoSanitize = require("express-mongo-sanitize");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/artifax";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
  console.log("Database Connected");
}

/* View Engine */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Middleware etc */
const {
  isLoggedIn,
  isAuthor,
  validateUser,
  validateChat,
  validatePrompt,
} = require("./middleware");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(mongoSanitize());

const secret = "VISUALFORGE";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret,
  },
});
store.on("error", function (e) {
  console.log(e);
});

app.use(
  session({
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  }),
);

app.use(flash());

app.use(helmet());
const scriptSrcUrls = [
  "https://code.jquery.com/",
  "https://fonts.googleapis.com/",
];
const styleSrcUrls = ["https://fonts.googleapis.com/"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'"],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://s3.amazonaws.com/stabled.response/",
      ],
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.idError = req.flash("idError");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("users/login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/chats");
  },
);

app.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      res.redirect("/");
    }
  });
});

app.get("/signup", (req, res) => {
  res.render("users/signup");
});

app.post(
  "/signup",
  validateUser,
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body.user;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) res.send(err);
        else {
          res.redirect("/chats");
        }
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }),
);

app.get("/chats/playground", (req, res) => {
  const { image } = req.query;
  res.render("chats/playground", { image });
});

app.post(
  "/chats/playground",
  catchAsync(async (req, res) => {
    const jsonResponse = await invokeLambda(req.body.textChat);
    const data = JSON.parse(jsonResponse);
    const image = data.url;
    res.redirect(`/chats/playground?image=${image}`);
  }),
);

app.get(
  "/chats",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = req.user;
    const oldChat = await Chat.find().populate("author");
    const chats = oldChat.filter(
      (chat) => chat.author.username === user.username,
    );
    chats.forEach((chat) => {
      const createdAt = moment(chat.createdAt);
      const currentTime = moment();
      chat.relativeTime = createdAt.from(currentTime);
    });
    chats.reverse();
    res.render("chats/index", {
      chats,
    });
  }),
);

app.get("/chats/new", isLoggedIn, (req, res) => {
  res.render("chats/new");
});

app.get("/chats/:id/edit", isLoggedIn, (req, res) => {
  res.render("chats/edit");
});

app.get(
  "/chats/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const currentChat = await Chat.findById(id)
      .populate("prompts")
      .populate("author");
    const chats = await Chat.find();
    chats.forEach((chat) => {
      const createdAt = moment(chat.createdAt);
      const currentTime = moment();
      chat.relativeTime = createdAt.from(currentTime);
    });
    chats.reverse();
    currentChat.prompts.reverse();
    res.render("chats/chat", { chats, currentChat });
  }),
);

app.post(
  "/chats",
  isLoggedIn,
  validateChat,
  catchAsync(async (req, res) => {
    const chat = new Chat(req.body);
    chat.author = req.user._id;
    await chat.save();
    res.redirect(`/chats/${chat._id}`);
  }),
);

app.delete(
  "/chats/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const chat = await Chat.findByIdAndDelete(id).populate("prompts");
    const extractedFileNames = chat.prompts.map((prompt) => ({
      Key: prompt.responseFileName,
    }));
    await deleteMultipleObject(extractedFileNames);
    res.redirect("/chats");
  }),
);

app.post(
  "/chats/:id/prompts",
  isLoggedIn,
  validatePrompt,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const chat = await Chat.findById(id);
    const prompt = new Prompt(req.body);
    const jsonResponse = await invokeLambda(req.body.textChat);
    const data = JSON.parse(jsonResponse);
    prompt.responseUrl = data.url;
    prompt.responseFileName = data.filename;
    prompt.author = req.user._id;
    chat.prompts.push(prompt);
    await prompt.save();
    await chat.save();
    res.redirect(`/chats/${id}`);
  }),
);

app.put(
  "/chats/:id/prompts/:promptId",
  isLoggedIn,
  validatePrompt,
  catchAsync(async (req, res) => {
    const { id, promptId } = req.params;
    const prompt = await Prompt.findByIdAndUpdate(promptId, {
      textChat: req.body.textChat,
    });
    await deleteObject(prompt.responseFileName);
    const jsonResponse = await invokeLambda(req.body.textChat);
    const data = JSON.parse(jsonResponse);
    prompt.responseUrl = data.url;
    prompt.responseFileName = data.filename;
    await prompt.save();
    res.redirect(`/chats/${id}`);
  }),
);

app.delete(
  "/chats/:id/prompts/:promptId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, promptId } = req.params;
    const prompt = await Prompt.findByIdAndDelete(promptId);
    await deleteObject(prompt.responseFileName);
    req.flash("success", "Successfully deleted prompt");
    res.redirect(`/chats/${id}`);
  }),
);

app.put(
  "/chats/:id/prompts/:promptId/response",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, promptId } = req.params;
    const prompt = await Prompt.findById(promptId);
    await deleteObject(prompt.responseFileName);
    const jsonResponse = await invokeLambda(prompt.textChat);
    const data = JSON.parse(jsonResponse);
    prompt.responseUrl = data.url;
    prompt.responseFileName = data.filename;
    await prompt.save();
    res.redirect(`/chats/${id}`);
  }),
);

/* 404 */
app.all("*", (req, res, next) => {
  next(
    new ExpressError(
      404,
      "Page Not Found!",
      "This page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
    ),
  );
});

/* Error handling middleware */
app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(err.statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
