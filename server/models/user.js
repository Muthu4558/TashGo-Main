// models/user.js
import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    tenantId: {
      type: String,
      required: function () {
        return this.isAdmin || this.isSuperAdmin;
      },
    },
    companyName: { type: String, required: true }, // New Field
    name: { type: String, required: true },
    title: {
      type: String,
      required: function () {
        return !this.isAdmin && !this.isSuperAdmin; // Only for regular users
      },
    },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isSuperAdmin: { type: Boolean, required: true, default: false },
    userLimit: { type: Number, default: 0 }, // NEW FIELD for admins
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
