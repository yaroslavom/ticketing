import React, { useEffect } from 'react';
import Router from 'next/router';

import useRequest from '../../hook/use-request';

const SignOut = () => {
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'POST',
        data: {},
        onSuccess: () => Router.push('/')
    });

    useEffect(() => {
        doRequest()
    }, []);

    return (<>Signing you out...</>)
}

export default SignOut;