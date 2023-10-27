import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({
      username: event.target.value,
    })
  }

  onChangePassword = event => {
    this.setState({
      password: event.target.value,
    })
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      errorMsg,
      showSubmitError: true,
    })
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <div className="input-container">
            <label htmlFor="username" className="label">
              USERNAME{' '}
            </label>{' '}
            <input
              type="text"
              placeholder="Username"
              id="username"
              className="input"
              onChange={this.onChangeUsername}
              value={username}
            />{' '}
          </div>{' '}
          <div className="input-container">
            <label htmlFor="password" className="label">
              PASSWORD{' '}
            </label>{' '}
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="input"
              onChange={this.onChangePassword}
              value={password}
            />{' '}
          </div>{' '}
          <button type="submit" className="button">
            Login{' '}
          </button>{' '}
          {showSubmitError && <p className="error-msg"> {errorMsg} </p>}{' '}
        </form>{' '}
      </div>
    )
  }
}

export default Login
