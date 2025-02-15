import axios from "axios";

export const likepost = async (postid,id) => {
    try {
        const token = localStorage.getItem("accessToken");
        const payload =
            {
                "userId": id,
            }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/like/${postid}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}