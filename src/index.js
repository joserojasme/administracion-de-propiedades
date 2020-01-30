import React from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import App from './App';
import config from './cognito/awsConfig';
import reducer from './reducers/stores/index';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

Amplify.configure({
    Auth:{
        mandatorySignIn:false,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID,
        storage: window.localStorage
    },
    Storage:{
            bucket:'miinc.com.co',
            region: config.cognito.REGION,
            identityPoolId:config.cognito.IDENTITY_POOL_ID
    }
})

const store = createStore(
    reducer,
    {},
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
