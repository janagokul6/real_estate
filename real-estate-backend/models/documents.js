// models/Document.js
const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    file: {
      type: Object,
      required: true,
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },

    category: {
      type: String,
      enum: ["lease", "contract", "insurance", "other"],
      required: true,
    },

    accessPermissions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permissions: [
          {
            type: String,
            enum: ["read", "write", "delete", "all"],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
