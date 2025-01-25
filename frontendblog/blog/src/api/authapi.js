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

// export const fetchMaintainanceServices = async (hotelId, name) => {
//     try {
//         const token = localStorage.getItem("accessToken");
//         const payload =
//         {
//             "hXipperId": hotelId,
//             "serviceName": name,
//         }
//         const response = await axios.post(`${BASE_URL}/user/hotel/services/getMaintenanceItems`, payload, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (err) {
//         return err.response;
//     }
// }