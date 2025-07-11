import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import TermsModal from "./TermsAndCondition";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const initialFormState = {
  productName: "",
  description: "",
  price: "",
  category: "",
  hostel: "",
  phoneNumber: "",
  images: [],
  termsAgreed: false,
};

const AddItem = ({ user, categories, setCategories }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState(initialFormState);
  const [hostels, setHostels] = useState();

  // Simplified function to set form data from API response
  const setItemData = (itemDetails) => {
    setFormData({
      productName: itemDetails.name || "",
      description: itemDetails.description || "",
      price: itemDetails.price || "",
      category: itemDetails.category || "",
      hostel: itemDetails.hostel || "",
      phoneNumber: itemDetails.phone || "",
      images: itemDetails.images || [],
      termsAgreed: true,
    });
    setPreviewImages(itemDetails.images || []);
  };

  useEffect(() => {
    const getHostel = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/hostels`, {
          withCredentials: true,
        });
        setHostels(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getHostel();

    const getCategories = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/categories`, {
          withCredentials: true,
        });
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    if (!categories || categories.length === 0) {
      getCategories();
    }
  }, []);

  // AUTH: Block if not logged in
  useEffect(() => {
    const getuserdetails = async () => {
      try {
        const res = await axios.get(`${VITE_API_URL}/misc?id=1`, {
          withCredentials: true,
        });
        if (res.data) {
          setFormData((prev) => ({
            ...prev,
            hostel: res.data.hostel,
            phoneNumber: res.data.phone,
          }));
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    if (!id) {
      getuserdetails();
    }
  }, []);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to access this page.");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  // Fetch item data for editing
  useEffect(() => {
    const fetchItemForEdit = async () => {
      if (id) {
        try {
          const res = await axios.get(`${VITE_API_URL}/items/${id}`, {
            withCredentials: true,
          });

          if (res.data && res.data.details) {
            setItemData(res.data.details);
          }
        } catch (err) {
          console.error("Error fetching item for edit:", err);
          toast.error("Error loading item details");
        }
      }
    };
    fetchItemForEdit();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (formData.images.length + files.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }
    const newPreviewImages = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPreviewImages.push(ev.target.result);
        if (newPreviewImages.length === files.length) {
          setPreviewImages([...previewImages, ...newPreviewImages]);
        }
      };
      reader.readAsDataURL(file);
    });
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    if (formErrors.images) {
      setFormErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });
    setPreviewImages((prev) => {
      const updatedPreviews = [...prev];
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  // Accepts +91XXXXXXXXXX or 10 digits
  const phoneRegex = /^(\+91)?\d{10}$/;

  const validateForm = () => {
    const errors = {};
    if (!formData.productName.trim())
      errors.productName = "Product name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!String(formData.price).trim()) errors.price = "Price is required";
    if (isNaN(Number(formData.price)) || Number(formData.price) < 0)
      errors.price = "Please enter a valid price";
    if (!formData.category) errors.category = "Please select a category";
    if (!formData.hostel) errors.hostel = "Please select your hostel";
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid phone number";
    }
    if (formData.images.length === 0)
      errors.images = "Please upload at least one image";
    if (!formData.termsAgreed)
      errors.termsAgreed = "You must agree to the terms and conditions";
    return errors;
  };

  const getCSRFTokenFromCookies = () => {
    const name = "csrftoken=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i].trim();
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to perform this action.");
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const categoryId = categories.find(
      (cat) => cat.name == formData.category
    ).id;

    const formDataToSend = new FormData();
    formDataToSend.append("itemName", formData.productName);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("itemPrice", Number(formData.price));
    formDataToSend.append("category", categoryId);
    formDataToSend.append("sellerHostel", formData.hostel);
    formDataToSend.append("contactNumber", formData.phoneNumber);
    formData.images.forEach((img) => {
      if (img instanceof File) {
        formDataToSend.append("images", img);
      } else if (typeof img === "string") {
        formDataToSend.append("existingImages", img);
      }
    });

    try {
      const csrfToken = getCSRFTokenFromCookies();
      if (!csrfToken) {
        toast.error("Failed to retrieve CSRF token.");
        return;
      }

      const endpoint = id
        ? `${VITE_API_URL}/items/${id}`
        : `${VITE_API_URL}/items/`;
      const res = await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      });

      toast.success(
        id ? "Item updated successfully!" : "Product listed successfully!"
      );

      navigate("/mylistings");
    } catch (err) {
      toast.error("Error saving item. Please try again.");
      console.error(err);
    }
  };

  const toggleTermsModal = () => setIsTermsOpen((open) => !open);

  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div
      className="py-8 px-4 sm:px-6 lg:px-8 w-[100vw] dark:bg-gray-900 overflow-auto"
      style={{ height: "calc(100dvh - 56px)" }}
    >
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ x: -5 }}
      >
        <FiArrowLeft className="w-5 h-5 mr-2" />
        Back
      </motion.button>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-4 mb-14 lg:mb-0"
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {id ? "Edit Your Product" : "List Your Product"}
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
                  <option key={index} value={category.name}>
                    {category.name}
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
                <option value="" style={{ display: "none" }}>
                  Select your hostel
                </option>
                {hostels?.map((hostel, index) => (
                  <option key={index} value={hostel.name}>
                    {hostel.name.toUpperCase()}
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
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`block w-full px-3 outline-0 py-2 border ${
                  formErrors.phoneNumber
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                placeholder="10-digit or +91XXXXXXXXXX"
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
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
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
                {id ? "Update Product" : "List Product"}
              </motion.button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
      {/* Terms Modal */}
      {isTermsOpen && (
        <TermsModal isOpen={isTermsOpen} setIsOpen={setIsTermsOpen} />
      )}
    </div>
  );
};

export default AddItem;
