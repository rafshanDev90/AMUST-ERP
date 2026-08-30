const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    dueDate: {
      type: Date,
      required: true
    },

    paid: {
      type: Boolean,
      default: false
    },

    paidOn: Date,

    paymentMode: {
      type: String,
      enum: ["cash", "online", "cheque"],
      default: "cash"
    },

    // 🔹 NEW FIELDS
    discount: {
      type: Number,
      default: 0 // scholarship / concession
    },

    fine: {
      type: Number,
      default: 0 // late fee
    },

    note: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
