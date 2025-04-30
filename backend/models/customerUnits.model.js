import mongoose from "mongoose";

const customerUnitsSchema = new mongoose.Schema(
  {
    unitNo: {
      type: String,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    unitName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    certifications: [{
      type: String,
    }],
    warehousing: [{
      type: String,
    }],
    extrusion: [{
      type: String,
    }],
    collecting: [{
      type: String,
    }],
    manufacturing: [{
      type: String,
    }],
    trading: [{
      type: String,
    }],
    mechanicalRecycling: [{
      type: String,
    }],
    printing: [{
      type: String,
    }]
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate unitNo
customerUnitsSchema.pre('save', async function(next) {
  if (!this.unitNo) {
    try {
      const lastUnit = await this.constructor.findOne({}, {}, { sort: { 'unitNo': -1 } });
      let nextNumber = 1;
      
      if (lastUnit && lastUnit.unitNo) {
        const lastNumber = parseInt(lastUnit.unitNo.split('_')[1]);
        nextNumber = lastNumber + 1;
      }
      
      this.unitNo = `UNIT_${String(nextNumber).padStart(4, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const CustomerUnit = mongoose.model("CustomerUnit", customerUnitsSchema, "customerUnits");

export default CustomerUnit;
