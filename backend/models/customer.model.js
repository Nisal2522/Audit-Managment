import mongoose from "mongoose";
const customerSchema = new mongoose.Schema(
  {
    cuNo: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    address: {
      mainAddress: {
        type: String,
        required: true,
      },
      invoiceAddress: {
        type: String,
        required: true,
      },
    },
    email: {
      mainEmail: {
        type: String,
        required: true,
      },
      invoiceEmail: {
        type: String,
        required: true,
      },
    },
    companySize: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
    manualDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to generate cuNo
customerSchema.pre('save', async function(next) {
  if (!this.cuNo) {
    try {
      const lastCustomer = await this.constructor.findOne({}, {}, { sort: { 'cuNo': -1 } });
      let nextNumber = 1;
      
      if (lastCustomer && lastCustomer.cuNo) {
        const lastNumber = parseInt(lastCustomer.cuNo.split('_')[1]);
        nextNumber = lastNumber + 1;
      }
      
      this.cuNo = `AMS_${String(nextNumber).padStart(4, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
