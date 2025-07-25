import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
const Login = ({ onLogin }) => {
  const handleLoginSuccess = (credentialResponse) => {
    try {
      const user = jwtDecode(credentialResponse.credential);
      onLogin(user);
      toast.success(`Welcome ${user.name}! 🎉`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // location.reload();
    } catch (error) {
      console.error("Login decoding failed:", error);
      toast.error("Login failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
    toast.error("Login failed. Please try again.");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex flex-col gap-8 items-center">
        {/* Left Side - Welcome Content */}
        <motion.div
          className="text-center space-y-6 mb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl lg:text-6xl font-bold text-black dark:text-white">
              Welcome Back!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
              Sign in to access your account and explore amazing features
            </p>
          </motion.div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          className="flex justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full"
            variants={itemVariants}
          >
            <motion.div
              className="text-center mb-8"
              initial="initial"
              animate="animate"
            >
              <div className="w-20 h-20  rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100 dark:bg-white">
                <FcGoogle className="text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Sign In
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Continue with your Google account
              </p>
            </motion.div>

            <motion.div
              className="space-y-6 flex justify-center items-center flex-col"
              variants={itemVariants}
            >
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <div className="flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={handleLoginError}
                      theme="outline"
                      size="large"
                      width="100%"
                      logo_alignment="left"
                      text="signin_with"
                    />
                  </motion.div>
                </div>
              </GoogleOAuthProvider>

              <motion.div
                className="text-center text-sm text-gray-500 dark:text-gray-400"
                variants={itemVariants}
              >
                <p>
                  By signing in, you agree to our{" "}
                  <a
                    href="/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Terms of Service
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
