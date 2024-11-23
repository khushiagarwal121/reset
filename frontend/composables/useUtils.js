export const useUtils = () => {
  // Function to encrypt the password
  const encryptPassword = (password) => {
    try {
      password = encodeURIComponent(password); // Encode password to handle special characters

      // Encrypt password in browser environment
      if (typeof window !== "undefined") {
        const pswd = window.btoa(password); // Base64 encoding for browser
        return pswd;
      }

      // Fallback for server-side rendering (SSR)
      const pswd = Buffer.from(password).toString("base64"); // Base64 encoding for SSR
      return pswd;
    } catch (error) {
      throw new Error("Failed to encrypt password"); // Throw error for handling
    }
  };

  // Return utility functions
  return {
    encryptPassword,
  };
};
