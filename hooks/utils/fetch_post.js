import * as SecureStore from "expo-secure-store";

const getToken = async () => {
    return await SecureStore.getItemAsync("token");
};

const fetchPost = async (
    url,
    data = {},
    method = "POST"
) => {
    try {
        const token = await getToken();
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: token
                    ? `Bearer ${token}`
                    : "",
            },
        };
        if (method !== "GET") {
            options.body = JSON.stringify(data);
        }
        const res = await fetch(url, options);
        const result = await res.json();
        return {
            ok: res.ok,
            status: res.status,
            data: result,
        };
    } catch (error) {
        return {
            ok: false,
            error: error.message,
        };
    }
};

export default fetchPost;