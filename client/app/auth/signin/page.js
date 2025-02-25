"use client"
import React, { useState, useCallback } from 'react';
import Router from 'next/router';

import ErrorList from '../../../components/error-list';
import useRequest from '../../../hook/use-request';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'POST',
        data: { email, password },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        await doRequest();   
    }, [email, password]);

    return (
        <form onSubmit={onSubmit}> 
            <h1>Sign In</h1>
            <div className="mb-3">
                <label>Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
            </div>
            <div className="mb-3">
                <label>Password Address</label>
                <input value={password} onChange={e => setPassword(e.target.value)}  type="password" className="form-control" />
            </div>
            <ErrorList errors={errors} />
            <button className="btn btn-primary">Sign In</button>
        </form>
    )
}

export default SignIn;