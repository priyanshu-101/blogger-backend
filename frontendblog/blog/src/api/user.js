import axios from "axios";

export const updateuser = async ( email, password , id) => {
    try {
        const token = localStorage.getItem("accessToken");
        const payload = {
            "email": email,
            "password": password
        }   
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/user/userprofile/${id}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    }
    catch (error) {
        return error.response.data;
    }
}