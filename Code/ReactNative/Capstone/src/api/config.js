import axios from "axios";

const URL_BASE = "https://pet-dating-server.herokuapp.com/";

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

// export const RequestApiAsyncGet = (endpoint) => {
//     const defaultOptions = {
//         baseURL: URL_BASE.concat(endpoint),
//         method: 'get',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     }

//     // Create instance
//     let instance = axios.create(defaultOptions);

//     // Set the AUTH token for any request
//     instance.interceptors.request.use(function (config) {
//         const token = useSelector(state => state.auth.token)
//         config.headers.Authorization = token ? `${token}` : '';
//         console.log(token)
//         return config;
//     });

//     return instance;  
// }