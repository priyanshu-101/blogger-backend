import axios from "axios";

export const sendotp = async (email) => {
    try {
        const token = localStorage.getItem("accessToken");
        const payload = {
            "email": email,
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/otp/send-otp`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export const verifyotp = async (email, otp) => {
    try {
        const token = localStorage.getItem("accessToken");
        const payload = {
            "email": email,
            "otp": otp
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/otp/verify-otp`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}