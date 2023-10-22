const { userSchema, chatSchema, promptSchema } = require("./schemas");

const mongoose = require("mongoose");
const Chat = require("./models/chat");

const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const chat = await Chat.findById(id);
    if (!chat) {
      req.flash("idError", `Unable to load conversation ${id}`);
      return res.redirect("/chats");
    }
    if (!chat.author.equals(req.user._id)) {
      return next(
        new ExpressError(
          403,
          "Access Denied",
          "You do not have permission to access this resource.",
        ),
      );
    }
    next();
  } else {
    req.flash("idError", `Unable to load conversation ${id}`);
    return res.redirect("/chats");
  }
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  console.log(error);

  if (error) {
    req.flash("error", error.message);
    return res.redirect("/signup");
  }

  next();
};

module.exports.validateChat = (req, res, next) => {
  const { error } = chatSchema.validate(req.body);

  if (error) {
    req.flash("error", "Please fill in the chat title");
    return res.redirect("/chats/new");
  }

  next();
};

module.exports.validatePrompt = (req, res, next) => {
  const { error } = promptSchema.validate(req.body);
  const { id } = req.params;

  if (error) {
    req.flash("idError", "Please fill in the prompt field");
    return res.redirect(`/chats/${id}`);
  }

  next();
};
