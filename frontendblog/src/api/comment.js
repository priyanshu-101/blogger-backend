import axios from "axios";

export const createComments = async (id, comment) => {
    
    try {
        const token = localStorage.getItem("accessToken");
        const payload = {
            "postId":id,
            "content": comment,
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/comment/comments`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        return error.response.data;
    }
}

export const getComment = async (id) => {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/comment/comments/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}