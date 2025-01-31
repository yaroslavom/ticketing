import axios from "axios";
import { useState } from "react";

export default ({ url, method = "GET", data, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            const response = await axios({ url, method, data });
            setErrors(null);
            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err) {
            setErrors(err.response.data?.errors);
            return null;
        }
    };

    return { doRequest, errors };
};
