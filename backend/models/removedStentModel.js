import mongoose from "mongoose";

// models/patient.js

const RemovedStentSchema = new mongoose.Schema({
    caseId: String,
    laterality: String,
    removalDate: Date,
   removalLocation: String,
   mrnNo:String,
    removedBy: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
   
  });
  
  const RemovedStent = mongoose.model('RemovedStent', RemovedStentSchema);
  
  export default RemovedStent;
  