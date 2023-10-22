const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.userSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required().escapeHTML(),
    email: Joi.string().required().escapeHTML(),
    password: Joi.string()
      .min(3)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required()
      .escapeHTML(),
  }).required(),
});

module.exports.chatSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),
});

module.exports.promptSchema = Joi.object({
  textChat: Joi.string().min(1).required().escapeHTML(),
});
