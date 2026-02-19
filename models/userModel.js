import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide your name'],
    },

    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: [true, 'Email already exists'],
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    photo: { type: String, default: 'default.jpg' },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'A password must have at least 8 characters'],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords do not match',
      },
    },

    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    role: {
      type: String,
      enum: ['user', 'guide', 'admin'],
      default: 'user',
    },

    passwordChangedAt: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    passwordResetTokenCreatedAt: { type: Date, select: false },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

//Virtual Populate
userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'user',
  localField: '_id',
});

userSchema.pre('save', async function () {
  // 1) Hash password
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }

  // 2) Set passwordChangedAt
  if (!this.isNew && this.isModified('password')) {
    this.passwordChangedAt = Date.now() - 1000;
  }
});

userSchema.pre(/^find/, function () {
  this.where({ active: { $ne: false } });
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  this.passwordResetTokenCreatedAt = Date.now();
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;
