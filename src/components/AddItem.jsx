import React, { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { HeightContext } from "../contexts/HeightContext";
import { ItemsContext } from "../contexts/ItemsContext";
const AddItem = ({ setSearchVal }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const { height } = useContext(HeightContext);
  const { items } = useContext(ItemsContext);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "",
    hostel: "",
    phoneNumber: "",
    images: [],
    termsAgreed: false,
  });

  const [buyers, setbuyers] = useState();

  const categories = [
    "Electronics & Gadgets",
    "Kitchen & Cooking",
    "Books & Study Materials",
    "Sports & Fitness Gear",
    "Musical Instruments",
    "Dorm & Bedroom Essentials",
    "Room Decor",
    "Community & Shared Resources",
    "Digital Subscriptions & Accounts",
    "Others",
  ];

  const hostels = [
    "ah-1",
    "ah-2",
    "ah-3",
    "ah-4",
    "ah-5",
    "ah-6",
    "ah-7",
    "ah-8",
    "ah-9",
    "ch-1",
    "ch-2",
    "ch-3",
    "ch-4",
    "ch-5",
    "ch-6",
    "ch-7",
    "dh-1",
    "dh-2",
    "dh-3",
    "dh-4",
    "dh-5",
    "dh-6",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  useEffect(() => {
    const result = items.filter(
      (item) =>
        item.itemName.toLowerCase().includes(formData.productName) ||
        item.category.toLowerCase().includes(formData.productName) ||
        item.sellerName.toLowerCase().includes(formData.productName)
    );
    setbuyers(result);
  }, [formData]);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limit number of images
    if (formData.images.length + files.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    // Create preview URLs
    const newPreviewImages = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviewImages.push(e.target.result);
        if (newPreviewImages.length === files.length) {
          setPreviewImages([...previewImages, ...newPreviewImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    setFormData({
      ...formData,
      images: [...formData.images, ...files],
    });

    if (formErrors.images) {
      setFormErrors({
        ...formErrors,
        images: null,
      });
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);

    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);

    setFormData({
      ...formData,
      images: updatedImages,
    });
    setPreviewImages(updatedPreviews);
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.productName.trim())
      errors.productName = "Product name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.price.trim()) errors.price = "Price is required";
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      errors.price = "Please enter a valid price";
    if (!formData.category) errors.category = "Please select a category";
    if (!formData.hostel) errors.hostel = "Please select your hostel";

    const phoneRegex = /^\d{10}$/;
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid 10 digit phone number";
    }

    if (formData.images.length === 0)
      errors.images = "Please upload at least one image";
    if (!formData.termsAgreed)
      errors.termsAgreed = "You must agree to the terms and conditions";

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // This would normally be where you'd send the data to your backend
    console.log("Form submitted:", formData);

    toast.success("Product listed successfully!");
    // Show success toast and navigate
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const toggleTermsModal = () => {
    setIsTermsOpen(!isTermsOpen);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div
      className="py-8 px-4 sm:px-6 lg:px-8 w-[100vw]  dark:bg-gray-900 overflow-auto"
      style={{ height }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-4"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          List Your Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Product Name */}
            <motion.div variants={fadeIn} className="form-group">
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className={`block w-full outline-none px-3 py-2 border ${
                  formErrors.productName
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              />
              {formErrors.productName && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.productName}
                </p>
              )}
            </motion.div>
            {buyers?.length > 0 && buyers?.length !== items?.length && (
              <span className="dark:text-gray-500">
                {buyers.length} Buyers are available checkout{" "}
                <span
                  onClick={() => {
                    navigate("/");
                    setSearchVal(formData.productName);
                    console.log(formData.productName);
                  }}
                >
                  {" "}
                  here.
                </span>
              </span>
            )}
            {/* Description */}
            <motion.div variants={fadeIn} className="form-group">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={`block w-full outline-none px-3 py-2 border ${
                  formErrors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none`}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.description}
                </p>
              )}
            </motion.div>

            {/* Price */}
            <motion.div variants={fadeIn} className="form-group">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Price (₹)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                    ₹
                  </span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`block w-full pl-7 outline-none pr-3 py-2 border ${
                    formErrors.price
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="0.00"
                />
              </div>
              {formErrors.price && (
                <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
              )}
            </motion.div>

            {/* Category */}
            <motion.div variants={fadeIn} className="form-group">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`block w-full outline-none px-3 py-2 border ${
                  formErrors.category
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.category}
                </p>
              )}
            </motion.div>

            {/* Hostel */}
            <motion.div variants={fadeIn} className="form-group">
              <label
                htmlFor="hostel"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Hostel
              </label>
              <select
                id="hostel"
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                className={`block w-full outline-none px-3 py-2 border ${
                  formErrors.hostel
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
              >
                <option value="">Select your hostel</option>
                {hostels.map((hostel, index) => (
                  <option key={index} value={hostel}>
                    {hostel.toUpperCase()}
                  </option>
                ))}
              </select>
              {formErrors.hostel && (
                <p className="mt-1 text-sm text-red-500">{formErrors.hostel}</p>
              )}
            </motion.div>

            {/* Phone Number */}
            <motion.div variants={fadeIn} className="form-group">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium outline-0 text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`block w-full px-3 outline-0 py-2 border ${
                  formErrors.phoneNumber
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                placeholder="10-digit phone number"
              />
              {formErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.phoneNumber}
                </p>
              )}
            </motion.div>

            {/* Product Images */}
            <motion.div variants={fadeIn} className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Images (Max 5)
              </label>
              <div
                className={`border-2 border-dashed p-4 rounded-lg text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  formErrors.images
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onClick={triggerImageUpload}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Click to upload images (max 5)
                </p>
              </div>

              {formErrors.images && (
                <p className="mt-1 text-sm text-red-500">{formErrors.images}</p>
              )}

              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {previewImages.map((preview, index) => (
                    <div
                      key={index}
                      className="relative h-24 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                      >
                        <RxCross1 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div variants={fadeIn} className="form-group">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="termsAgreed"
                    name="termsAgreed"
                    type="checkbox"
                    checked={formData.termsAgreed}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="termsAgreed"
                    className="font-medium text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={toggleTermsModal}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                    >
                      terms and conditions
                    </button>
                  </label>
                  {formErrors.termsAgreed && (
                    <p className="mt-1 text-sm text-red-500">
                      {formErrors.termsAgreed}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={fadeIn} className="form-group">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                List Product
              </motion.button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>

      {isTermsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto px-4"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Terms and Conditions
                </h3>
                <button
                  onClick={toggleTermsModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <RxCross1 size={20} />
                </button>
              </div>

              <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                <ol className="list-decimal space-y-4">
                  {/* 1. Introduction */}
                  <li>
                    <strong>Introduction</strong>
                    <p>
                      BITS Pilani Store is a peer-to-peer marketplace created
                      exclusively for members of BITS Pilani across the Goa,
                      Pilani, and Hyderabad campuses. These Terms govern your
                      use of the platform as a buyer or seller.
                    </p>
                  </li>

                  {/* 2. Platform Nature and Limitations */}
                  <li>
                    <strong>Platform Nature and Limitations</strong>
                    <p>
                      BITS Pilani Store acts solely as a classified listings
                      service connecting buyers and sellers.
                    </p>
                    <p>
                      All communications and transactions happen outside the
                      platform. We do not:
                    </p>
                    <ul className="list-disc pl-5">
                      <li>Intervene in transactions</li>
                      <li>Process payments or offer escrow</li>
                      <li>Verify product authenticity</li>
                      <li>Guarantee transaction outcomes</li>
                    </ul>
                  </li>

                  {/* 3. User Eligibility and Accounts */}
                  <li>
                    <strong>User Eligibility and Accounts</strong>
                    <ul className="list-disc pl-5">
                      <li>
                        Only BITS Pilani members with official email IDs may use
                        the platform.
                      </li>
                      <li>One user = One account. No duplicates.</li>
                      <li>
                        You are accountable for all activity under your account.
                      </li>
                    </ul>
                  </li>

                  {/* 4. Listing Policies */}
                  <li>
                    <strong>Listing Policies</strong>
                    <h4 className="font-semibold mt-2">4.1 Allowed Listings</h4>
                    <ul className="list-disc pl-5">
                      <li>Used textbooks and study materials</li>
                      <li>Working electronics</li>
                      <li>Furniture and daily-use hostel items</li>
                      <li>Any other legal, non-restricted items</li>
                    </ul>

                    <h4 className="font-semibold mt-2">
                      4.2 Prohibited Listings (Strict Ban)
                    </h4>
                    <ul className="list-disc pl-5">
                      <li>Drugs or drug-related items</li>
                      <li>Weapons</li>
                      <li>Stolen or unverified goods</li>
                      <li>Fake, pirated, or replica products</li>
                      <li>Expired consumables or medicine</li>
                      <li>Animals (live/dead)</li>
                      <li>Plagiarism/cheating tools</li>
                      <li>Adult or explicit content</li>
                      <li>Items violating campus policies or Indian law</li>
                    </ul>
                  </li>

                  {/* 5. Transaction Process */}
                  <li>
                    <strong>Transaction Process</strong>
                    <p>Contact sellers through the WhatsApp link provided.</p>
                    <p>All deals, chats, and payments happen off-platform.</p>
                    <p>Suggested best practices:</p>
                    <ul className="list-disc pl-5">
                      <li>Meet in safe, common areas on campus</li>
                      <li>Thoroughly inspect before paying</li>
                      <li>Use trusted payment channels like UPI</li>
                      <li>Keep screenshots or records</li>
                    </ul>
                  </li>

                  {/* 6. User Responsibilities */}
                  <li>
                    <strong>User Responsibilities</strong>
                    <h4 className="font-semibold mt-2">6.1 Sellers</h4>
                    <ul className="list-disc pl-5">
                      <li>Must post honest, clear product details</li>
                      <li>Reveal all defects or issues</li>
                      <li>Immediately mark listings as sold after sale</li>
                      <li>Follow prohibited item rules</li>
                    </ul>

                    <h4 className="font-semibold mt-2">6.2 Buyers</h4>
                    <ul className="list-disc pl-5">
                      <li>Must check item quality before payment</li>
                      <li>
                        Understand all sales are final unless otherwise agreed
                      </li>
                      <li>Report any suspicious or illegal listings</li>
                    </ul>
                  </li>

                  {/* 7. Disclaimers and Liability Limitations */}
                  <li>
                    <strong>Disclaimers and Liability Limitations</strong>
                    <p>We hold no liability for:</p>
                    <ul className="list-disc pl-5">
                      <li>User behavior</li>
                      <li>Product quality or legality</li>
                      <li>Outcome of any deal</li>
                      <li>Losses due to platform use</li>
                      <li>WhatsApp or external app interactions</li>
                    </ul>
                    <p>
                      You agree to indemnify BITS Pilani Store for any issues
                      arising from your usage.
                    </p>
                  </li>

                  {/* 8. Privacy and Data */}
                  <li>
                    <strong>Privacy and Data</strong>
                    <p>We collect minimum data only to run the platform.</p>
                    <p>
                      Seller contact is shared only when you click to contact
                      them or when the contact information is viewed.
                    </p>
                    <p>
                      No tracking or storing of personal chats or payment info.
                    </p>
                  </li>

                  {/* 9. Violations and Enforcement */}
                  <li>
                    <strong>Violations and Enforcement</strong>
                    <p>We may:</p>
                    <ul className="list-disc pl-5">
                      <li>Remove any listing without prior notice</li>
                      <li>Suspend or block accounts</li>
                      <li>
                        Inform BITS authorities if serious rules are broken
                      </li>
                      <li>Cooperate with law enforcement</li>
                    </ul>
                  </li>

                  {/* 10. Modifications */}
                  <li>
                    <strong>Modifications</strong>
                    <p>
                      Terms may be updated anytime. Continued usage implies
                      agreement to updated terms.
                    </p>
                  </li>

                  {/* 11. General Provisions */}
                  <li>
                    <strong>General Provisions</strong>
                    <ul className="list-disc pl-5">
                      <li>These Terms are the entire agreement between us.</li>
                      <li>If one part is invalid, the rest still apply.</li>
                      <li>
                        This platform is student-run and unaffiliated with BITS
                        Pilani administration.
                      </li>
                    </ul>
                    <p>
                      By using BITS Pilani Store, you confirm you have read,
                      understood, and agreed to these Terms.
                    </p>
                  </li>
                </ol>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={toggleTermsModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  I Understand
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AddItem;
