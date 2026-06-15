import mongoose from "mongoose";

const yearSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },

    label: {
      type: String,
      default: function () {
        return `${this.year}`;
      },
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

export default yearSchema;