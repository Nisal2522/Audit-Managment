import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import for navigation
import NavBar from "../../../components/NavBar";
import { ArrowLeft } from "lucide-react";

const CreateCustomerForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        department: "",
        address: {
            mainAddress: "",
            invoiceAddress: "",
        },
        email: {
            mainEmail: "",
            invoiceEmail: "",
        },
        companySize: "",
        manualDate: new Date().toISOString().split('T')[0], // Set default to today
    });
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user'));
    const employeeId = userData?.employeeId || '';

    const validateField = (name, value) => {
        const errors = { ...fieldErrors };
        switch (name) {
            case "name":
                if (!value.trim()) {
                    errors[name] = "Name is required.";
                } else {
                    delete errors[name];
                }
                break;
            case "department":
                if (!value) {
                    errors[name] = "Please select a department.";
                } else {
                    delete errors[name];
                }
                break;
            case "address.mainAddress":
            case "address.invoiceAddress":
                if (!value.trim()) {
                    errors[name] = "Address is required.";
                } else {
                    delete errors[name];
                }
                break;
            case "email.mainEmail":
            case "email.invoiceEmail":
                if (!value.trim()) {
                    errors[name] = "Email is required.";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors[name] = "Invalid email format.";
                } else {
                    delete errors[name];
                }
                break;
            case "companySize":
                if (!value.trim()) {
                    errors[name] = "Company size is required.";
                } else if (isNaN(Number(value))) {
                    errors[name] = "Company size must be a number.";
                } else {
                    delete errors[name];
                }
                break;
            default:
                break;
        }
        setFieldErrors(errors);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("address.") || name.includes("email.")) {
            const [field, subField] = name.split(".");
            setFormData((prevState) => ({
                ...prevState,
                [field]: {
                    ...prevState[field],
                    [subField]: value,
                },
            }));
        } else {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
        }
        validateField(name, value); // Validate the field as the user types
    };

    const validateStep = () => {
        let isValid = true;
        const errors = {};
        if (step === 1) {
            if (!formData.name.trim()) {
                errors.name = "Name is required.";
                isValid = false;
            }
            if (!formData.department) {
                errors.department = "Please select a department.";
                isValid = false;
            }
        } else if (step === 2) {
            if (!formData.address.mainAddress.trim()) {
                errors["address.mainAddress"] = "Main Address is required.";
                isValid = false;
            }
            if (!formData.address.invoiceAddress.trim()) {
                errors["address.invoiceAddress"] = "Invoice Address is required.";
                isValid = false;
            }
        } else if (step === 3) {
            if (!formData.email.mainEmail.trim()) {
                errors["email.mainEmail"] = "Main Email is required.";
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.mainEmail)) {
                errors["email.mainEmail"] = "Invalid email format.";
                isValid = false;
            }
            if (!formData.email.invoiceEmail.trim()) {
                errors["email.invoiceEmail"] = "Invoice Email is required.";
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.invoiceEmail)) {
                errors["email.invoiceEmail"] = "Invalid email format.";
                isValid = false;
            }
            if (!formData.companySize.trim()) {
                errors.companySize = "Company Size is required.";
                isValid = false;
            } else if (isNaN(Number(formData.companySize))) {
                errors.companySize = "Company size must be a number.";
                isValid = false;
            }
        }
        setFieldErrors(errors);
        return isValid;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep((prevStep) => prevStep + 1);
        } else {
            setError("Please fill out all required fields.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!validateStep()) {
            setError("Please fix the errors in the form.");
            return;
        }
        try {
            const formDataWithEmployeeId = {
                ...formData,
                employeeId: employeeId
            };
            await axios.post("http://localhost:5006/api/customers", formDataWithEmployeeId);
            setSuccess("Customer created successfully!");
            setFormData({
                name: "",
                department: "",
                address: { mainAddress: "", invoiceAddress: "" },
                email: { mainEmail: "", invoiceEmail: "" },
                companySize: "",
                manualDate: new Date().toISOString().split('T')[0],
            });
            setStep(1);
            setFieldErrors({});
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
    };

    const prevStep = () => setStep((prevStep) => prevStep - 1);

    const titles = ["Basic Information", "Address Details", "Contact Details"];
    const containerVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
    };
    const buttonHover = {
        hover: { scale: 1.05, boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)" },
        tap: { scale: 0.95 },
    };
    const messageVariants = {
        hidden: { scale: 0 },
        visible: { scale: 1, transition: { type: "spring", stiffness: 300 } },
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-stretch">
            <NavBar />
            <motion.div
                className="w-full max-w-lg bg-[#022847] border-2 p-8 rounded-lg shadow-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.6 } }}
            >
                <button>
                    <motion.button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="ml-2"
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonHover}
                    >
                        <ArrowLeft className="w-6 h-6 text-white" />
                    </motion.button>
                </button>
                <span className="text-4xl font-extrabold text-white p-4 text-center block">
                    Create Customer
                </span>
                <h2 className="text-xl text-white font-semibold mb-6 pt-6">{titles[step - 1]}</h2>
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="mb-4 text-red-600 bg-red-100 p-3 rounded"
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {success && (
                        <motion.div
                            className="mb-4 text-green-600 bg-green-100 p-3 rounded"
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>
                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {step === 1 && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-base font-medium text-white mb-2">
                                            Customer Number
                                        </label>
                                        <input
                                            type="text"
                                            value="Auto-generated"
                                            disabled
                                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500"
                                        />
                                        <p className="text-gray-400 text-sm mt-1">Customer number will be auto-generated in format: AMS_XXXX</p>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-base font-medium text-white mb-2">
                                            Employee ID (Creator)
                                        </label>
                                        <input
                                            type="text"
                                            value={employeeId}
                                            disabled
                                            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-gray-500"
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-base font-medium text-white mb-2">
                                            Creation Date
                                        </label>
                                        <input
                                            type="date"
                                            name="manualDate"
                                            value={formData.manualDate}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-base font-medium text-white mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors.name && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-base font-medium text-white mb-2">
                                            Department
                                        </label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="" disabled>
                                                Select Department
                                            </option>
                                            <option value="Food">Food</option>
                                            <option value="Organic">Organic</option>
                                            <option value="Textile">Textile</option>
                                            <option value="IT">IT</option>
                                        </select>
                                        {fieldErrors.department && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.department}</p>
                                        )}
                                    </div>
                                </>
                            )}
                            {step === 2 && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-base font-medium text-white mb-2">
                                            Main Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address.mainAddress"
                                            value={formData.address.mainAddress}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors["address.mainAddress"] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {fieldErrors["address.mainAddress"]}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Invoice Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address.invoiceAddress"
                                            value={formData.address.invoiceAddress}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors["address.invoiceAddress"] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {fieldErrors["address.invoiceAddress"]}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                            {step === 3 && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Main Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email.mainEmail"
                                            value={formData.email.mainEmail}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors["email.mainEmail"] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {fieldErrors["email.mainEmail"]}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Invoice Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email.invoiceEmail"
                                            value={formData.email.invoiceEmail}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors["email.invoiceEmail"] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {fieldErrors["email.invoiceEmail"]}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-white mb-2">
                                            Company Size
                                        </label>
                                        <input
                                            type="text"
                                            name="companySize"
                                            value={formData.companySize}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {fieldErrors.companySize && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {fieldErrors.companySize}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-between mt-6">
                        {step > 1 && (
                            <motion.button
                                type="button"
                                onClick={prevStep}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonHover}
                            >
                                Back
                            </motion.button>
                        )}
                        {step < 3 && (
                            <motion.button
                                type="button"
                                onClick={nextStep}
                                className="px-4 py-2 bg-[#1d4769] text-white rounded-lg"
                                whileHover="hover"
                                whileTap="tap"
                                variants={buttonHover}
                            >
                                Next
                            </motion.button>
                        )}
                        {step === 3 && (
                            <>
                                <motion.button
                                    type="submit"
                                    className="px-4 py-2 bg-green-800 text-white rounded-lg animate-bounce"
                                    whileHover="hover"
                                    whileTap="tap"
                                    variants={buttonHover}
                                >
                                    Submit
                                </motion.button>

                            </>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateCustomerForm;