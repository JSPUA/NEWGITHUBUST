import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const stentLogSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  details: {
    // This can be an object or specific fields depending on what you want to log
    type: Object,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
 patientIcNo: {
    type: String,
    required: true
  },
  hospitalName: {
    type: String,
    required: true
  },
});

const StentLog = model('StentLog', stentLogSchema);

export default StentLog;
