import { googleLogout } from '@react-oauth/google';
import '../App.css'

function Logout({setclientToken,setConversation}) {
  const handleLogout = async () => {
    googleLogout(); 
    
    localStorage.setItem('clientToken','');
    setclientToken('')
    setConversation([])
  };

  return (
    <button className='logout' onClick={handleLogout}>
      Logout
    </button>
  );
}

export default Logout;
