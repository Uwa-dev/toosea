import React from 'react'
import "./login.css";
const Login = () => {
  return (
    <form action="">
        <h1>Login</h1>
        <div>
            <label htmlFor="">Username:</label>
            <input type="text" />
        </div>
        <div>
            <label htmlFor="">Password:</label>
            <input type="text" />
        </div>
    </form>
  )
}

export default Login