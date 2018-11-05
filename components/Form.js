import React from 'react';
import {Form} from 'redux-form';

export default ({onSubmit, ...props}) => (
    <Form onSubmit={onSubmit} {...props} onKeyDown={e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
        }
    }}/>
);