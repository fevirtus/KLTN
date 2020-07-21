import axios from "axios";

const URL_BASE = "https://pet-dating-server.herokuapp.com/api/";

export const setAuthToken = token => {
    if (token) {
        // Apply authorization token to every request if logged in
        axios.defaults.headers.common["Authorization"] = token
    } else {
        // Delete auth header
        delete axios.defaults.headers.common["Authorization"]
    }
}

export const RequestApiAsyncPost = (endpoint, method, headers = {}, body) => {
    const endPointUrl = URL_BASE.concat(endpoint);
    console.log(endPointUrl);
    const requestBody = body ? JSON.stringify(body) : null;
    const headerParam = { headers }
    if ((method === "POST" && method === "PUT") && !requestBody) {
        throw new Error("Request body required!");
    }
    if (body) {
        headerParam.headers["Content-type"] = "application/json";
        return axios({
            method: method,
            url: endPointUrl,
            data: requestBody,
            headers: headerParam.headers
        });
    }
}

export const RequestApiAsyncGet = async(endpoint, headers = {}, params = {}) => {
    const endPointUrl = URL_BASE.concat(endpoint);
    const requestParam = { params };
    return await axios({
        method: 'GET',
        url: endPointUrl,
        params: requestParam,
        headers: headers
    });
}