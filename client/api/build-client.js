import axios from "axios";

export default ({ req }) => {
    /**
     * If we listening inside the client container, to prevent this we detect ingress-nginx namespace and redirect to LoadBalancer;
     */
    const domain = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
    /* Detecting code execution inside a server or browser */
    if (typeof window === 'undefined') { 
        return axios.create({ baseURL: domain, headers: req.headers })
    } else {
        return axios.create({ baseURL: '/' })
    }
};