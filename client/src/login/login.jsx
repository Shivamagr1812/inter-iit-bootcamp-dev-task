import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://interiitps.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    
    const apiUrl = isSignUp ? `${backendUrl}/api/v1/users/register` : `${backendUrl}/api/v1/users/login`; // Adjust the API endpoint accordingly
    const payload = isSignUp ? { username, email, password } : { email, password }; // Include email only on sign up

    console.log('Username:', username); // Debugging log
    console.log('Email:', email); // Debugging log (only on sign up)
    console.log('Is Sign Up:', isSignUp); // Debugging log
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include', // Include cookies with the request
      });

      console.log('Response Status:', response.status); // Log response status

      if (response.ok) {
        // Redirect to the chat page after successful login/signup
        if(isSignUp){
          setUsername('');
          setEmail('');
          setPassword('');
          alert('Sign up successful! Now click on the login button to log in!');
          navigate('/');
        }else{
          navigate('/chat');
        }
      } else {
        // Handle errors (optional: display an error message)
        const errorData = await response.json();
        console.error('Error Response:', errorData.error); // Log error for debugging
        alert(errorData.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Fetch Error:', error); // Log fetch error
      alert('Failed to connect to the server.');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-[#060f2b] h-[100vh]">
      <div className="mx-auto flex w-full flex-col justify-center px-5 pt-0 md:h-[unset] md:max-w-[50%] lg:h-[100vh] min-h-[100vh] lg:max-w-[50%] lg:px-6">
        <a className="mt-10 w-fit text-white" href="/">
          <div className="flex w-fit items-center lg:pl-0 lg:pt-0 xl:pt-0">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 320 512"
              className="mr-3 h-[13px] w-[8px] text-white dark:text-white"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path>
            </svg>
            <p className="ml-0 text-sm text-white">Back to the website</p>
          </div>
        </a>
        <div className="text-center mt-10 text-4xl font-bold text-white">VenusX</div>
        <div className='flex justify-center items-center my-3'>
          <div className='h-[1px] w-[65%] text-center bg-white'></div>
        </div>
        <div className="my-auto mb-auto mt-8 flex flex-col w-[350px] max-w-[450px] mx-auto md:max-w-[450px] lg:max-w-[450px]">
          <p className="text-[32px] font-bold text-white dark:text-white">{isSignUp ? 'Sign Up' : 'Log In'}</p>
          <p className="mb-2.5 mt-2.5 font-normal text-white dark:text-zinc-400">
            {isSignUp ? 'Create your account!' : 'Enter your email and password to log in!'}
          </p>
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="pb-2">
              <div className="grid gap-2">
                {isSignUp && ( // Conditionally render username input for sign up
                  <>
                    <label className="text-white dark:text-white" htmlFor="username">Username</label>
                    <input
                      className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-gray-800 dark:text-white dark:placeholder:text-zinc-400"
                      id="username"
                      placeholder="Username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </>
                )}
                <label className="text-white dark:text-white" htmlFor="email">Email</label>
                <input
                  className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-gray-800 dark:text-white dark:placeholder:text-zinc-400"
                  id="email"
                  placeholder="Email"
                  type="email" // Changed type to email for validation
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="text-white" htmlFor="password">Password</label>
                <input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-gray-800 dark:text-white dark:placeholder:text-zinc-400"
                  required
                />
                <button
                  className="text-white whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-zinc-200 bg-primary text-primary-foreground hover:bg-primary/90 mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium"
                  type="submit"
                >
                  {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
                </button>
              </div>
            </form>
            <p className="mt-4">
              {isSignUp ? (
                <span className='text-white'>
                  Already have an account? 
                  <button 
                    onClick={() => setIsSignUp(false)} 
                    className="font-medium text-white text-sm ml-1"
                  >
                    Log In
                  </button>
                </span>
              ) : (
                <span className='text-white'>
                  Don't have an account? 
                  <button 
                    onClick={() => setIsSignUp(true)} 
                    className="font-medium text-white text-sm ml-1"
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
