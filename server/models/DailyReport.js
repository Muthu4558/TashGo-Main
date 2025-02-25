import mongoose from "mongoose";

const dailyReportSchema = mongoose.Schema(
  {
    content: { 
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "Todo" 
    },
    remark : {
      type : String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // tenantId: { type: mongoose.Schema.Types.String, required: true },
  },
  { timestamps: true }
);

const DailyReport = mongoose.model("DailyReport", dailyReportSchema);

export default DailyReport;