import axios from "axios";

export const getPosts = async () => {

    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/post/posts` , {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

        return response;
    } catch (error) {
        return error.response.data;
    }
}

export const createPost = async (title, content, tags) => {
    try {
        const token = localStorage.getItem("accessToken");
        const payload = {
            "title": title,
            "content": content,
            "tags": tags
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/post/posts`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    } catch (error) {
        return error.response.data;
    }
}
