import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import {
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
  Inputwrapper,
  FIELDS,
  BUTTONCLASSES,
} from '../assets/dummy';
import { API_USER } from '../utils/config';

const INITIAL_FORM = { name: '', email: '', password: '' };

const Signup = ({ onSwitchMode }) => {
  const [showPassword,setShowPassword]=useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data } = await axios.post(`${API_USER}/register`, formData);
       setMessage({
        text: 'Registration successful! You can now login.',
        type: 'success',
      });
      setFormData(INITIAL_FORM);
      navigate('/login')
      
    } catch (err) {
      console.error('Signup error', err);
      setMessage({
  text: err.response?.data?.message || 'An error occurred. Please try again.',
  type: 'error',
});

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8'>

   
 


      <div className='mb-6 text-center'>
        <div className='w-16 bg-gradient-to-br from-fuchsia-500 to-purple-500 rounded-full mx-auto flex items-center justify-center mb-4'>
          <UserPlus className='w-8 h-8 text-white' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>Create Account</h2>
        <p className='text-gray-500 text-sm mt-1'>Join TaskFlow to manage your tasks</p>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className='text-purple-500 w-5 h-5 mr-2' />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              className='w-full focus:outline-none text-sm text-gray-700'
              required
            />
             {showPassword && (
                          <button type="button" onClick={()=>setShowPassword((prev)=>!prev)}
                          className='ml-2 text-gray-500 hover:text-purple-500 transition-colors'>
                            {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5'/>}
                           </button>
                        )}
          </div>
        ))}

       <button type='submit' className={BUTTONCLASSES} disabled={loading}>
  {loading ? (
    'Signing Up...'
  ) : (
    <span className="flex items-center justify-center gap-1.5">
      <UserPlus className="w-4 h-4" />
      Sign Up
    </span>
  )}
</button>

      </form>

      <p className='text-center text-sm text-gray-600 mt-6'>
        Already have an account?{' '}
        <button
          onClick={onSwitchMode}
          className='text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors'
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
