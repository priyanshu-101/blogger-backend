import axios from "axios";

export const registeruser = async (name, email, password) => {
    try {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        const payload =
            {
                "username":name,
                "email": email,
                "password": password
            }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export const loginuser = async (email, password) => {
    try {
        const token = localStorage.getItem("accessToken");
        const payload =
            {
                "email": email,
                "password": password
            }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export const logoutuser = async (email) => {
    try {
        const token = localStorage.getItem("accessToken");
        const payload = {
            "email":email,
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}