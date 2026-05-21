// ======================================================
// 📁 models/Contact.model.js
// ======================================================

import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
   
    // ✅ FULL NAME
 
    name: {
      type: String,
      required: true,
      trim: true,
    },

    
    // ✅ EMAIL
   
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

   
    // ✅ PHONE
 
    phone: {
      type: String,
      required: true,
      trim: true,
    },

   
    // ✅ PREFERRED DATE
  
    preferredDate: {
      type: String,
      required: true,
    },

   
    // ✅ PREFERRED TIME
 
    preferredTime: {
      type: String,
      required: true,
    },

  
    // ✅ REASON
  
    inquiryReason: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model(
  "Contact",
  contactSchema
);

export default Contact;