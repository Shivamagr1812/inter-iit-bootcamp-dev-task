import { React } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import '../App.css'
const Signin = ({setclientToken}) => {

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;

            const decodeToken = (token) => {
                try {
                    return JSON.parse(atob(token.split('.')[1]));
                } catch (err) {
                    console.log('Error decoding token:', err);
                    return null;
                }
            };

            const decodedResult = await decodeToken(token);

            if (decodedResult) {
                let data = { email: decodedResult.email}
                let res = await axios.post('http://localhost:5000/signin', data, {
                    withCredentials: true
                });

               if(res.data.status){
                 localStorage.setItem("clientToken",res.data.token)
                 setclientToken(res.data.token)
               }
            }



        } catch (error) {
            console.error('Error decoding JWT:', error);
        }
    };


    return (
        <div className='signin'>

            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={(error) => {
                    console.error('Google login error:', error);
                }}
            />
        </div>
    )
}

export default Signin