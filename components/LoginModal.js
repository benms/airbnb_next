import React, { useState } from 'react'
import axios from 'axios'

const LoginModal = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async () => {
    const response = await axios.post('/api/auth/login', {
      email,
      password
    })
    console.log({response})

    if (response.data.status === 'error') {
      alert(response.data.message)
    }
  }

  return (
    <>
      <h2>Log in</h2>
      <div>
        <form onSubmit={event => {
            submit()
            event.preventDefault()
          }}>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <button>Log in</button>
        </form>

        <p>
          Don&apos;t have an account yet?
          <a href="#" onClick={() => props.showSignup()}>
            Sign up
          </a>
        </p>
      </div>
    </>
  )
}

export default LoginModal
