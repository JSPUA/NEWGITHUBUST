import mongoose from "mongoose";

const { Schema } = mongoose;

const ReplaceStentSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  mrnNo:String,
  removedStent: {
    caseId: String,
    laterality: String,
    hospitalName: String,
    insertionDate: Date,
    removalDate: Date,
    removedBy: String,
    removalLocation: String,
    remarks: String,
    // Include any additional fields relevant to the removed stent
  },
  newStent: {
    caseId: String,
    laterality: String,
    hospitalName: String,
    insertionDate: Date,
    dueDate: String,
    insertedBy: String,
    size: String,
    length: String,
    stentType: String,
    stentBrand: String,
    placeOfInsertion: String,
    remarks: String,
    // Include any additional fields relevant to the new stent
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  // Any additional information relevant to the replacement process
});

export default mongoose.model('ReplaceStent', ReplaceStentSchema);