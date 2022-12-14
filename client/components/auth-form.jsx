import React from 'react';
import AppContext from '../lib/app-context';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      accountType: '',
      patientId: null,
      signInError: false,
      passwordError: false,
      isLoading: true,
      networkError: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.patientId && this.props.email) {
      const { patientId, email } = this.props;
      this.setState({
        patientId,
        email,
        accountType: 'patient'
      });
    } else {
      this.setState({
        accountType: 'therapist',
        isLoading: false
      });
    }
  }

  handleClick(event) {
    const { id } = event.target;
    let demo;
    if (id === 'therapist') {
      demo = {
        email: 'demo@example.com',
        password: 'DemoPassword'
      };
      this.setState({ isLoading: true });
      fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(demo)
      })
        .then(res => res.json())
        .then(result => {
          if (result.user && result.token) {
            this.props.onSignIn(result);
          }
          if (result.error === 'invalid login') {
            this.setState({ signInError: true });
          } else {
            this.setState({ signInError: false });
          }
          this.setState({ isLoading: false });
        })
        .catch(error => {
          if (error) {
            this.setState({
              isLoading: false,
              networkError: true
            });
          }
        });
    }
    if (id === 'patient') {
      demo = {
        email: 'george@example.com',
        password: 'DemoPassword'
      };
      this.setState({ isLoading: true });
      fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(demo)
      })
        .then(res => res.json())
        .then(result => {
          if (result.user && result.token) {
            this.props.onSignIn(result);
          }
          if (result.error === 'invalid login') {
            this.setState({ signInError: true });
          } else {
            this.setState({ signInError: false });
          }
          this.setState({ isLoading: false });
        })
        .catch(error => {
          if (error) {
            this.setState({
              isLoading: false,
              networkError: true
            });
          }
        });
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    if (name === 'password' && value.length < 8) {
      this.setState({ passwordError: true });
    } else {
      this.setState({ passwordError: false });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    const { passwordError } = this.state;
    if (!passwordError) {
      fetch(`/api/auth/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
        .then(res => res.json())
        .then(result => {
          if (action === 'sign-up') {
            window.location.hash = 'sign-in';
          } else if (result.user && result.token) {
            this.props.onSignIn(result);
          }
          if (result.error === 'invalid login') {
            this.setState({ signInError: true });
          } else {
            this.setState({ signInError: false });
          }
        })
        .catch(error => {
          if (error) {
            this.setState({
              isLoading: false,
              networkError: true
            });
          }
        });
    }
  }

  render() {

    const { action } = this.props;
    const { handleChange, handleSubmit } = this;
    const { accountType, signInError, passwordError, isLoading, networkError } = this.state;

    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center mt-5 auth-load-container">
          <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      );
    }

    if (networkError) {
      return (
        <div className="d-flex justify-content-center mt-5 px-4">
          <div className="card mt-3">
            <div className="card-header">
              Error
            </div>
            <div className="card-body">
              <h5 className="card-title">Network Error</h5>
              <p className="card-text">It looks like there was an error connecting to the network. Please check your internet connection and try again.</p>
            </div>
          </div>
        </div>
      );
    }

    const actionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const demoDropdown = action === 'sign-up'
      ? 'dropdown d-none'
      : 'dropdown';
    const actionText = action === 'sign-up'
      ? 'Sign in instead'
      : 'Register';
    let actionDisplay = action === 'sign-up'
      ? 'text-muted ps-1'
      : 'd-none';
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    const forgotPasswordLink = action === 'sign-up'
      ? 'd-none'
      : 'text-muted ps-1';
    const errorText = signInError
      ? 'alert alert-danger py-2 mb-3'
      : 'd-none';
    const passwordErrorText = passwordError
      ? 'alert alert-danger py-2 mb-3'
      : 'd-none';
    if (accountType === 'patient') {
      actionDisplay = 'd-none';
    }
    return (
      <div className="row pt-3 align-items-center">
        <div className="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4 ms-auto me-auto">
          <div className="card p-3" style={{ backgroundColor: '#E7E6E6' }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className={errorText}>
                  <p className="my-1">Your email or password was incorrect.</p>
                  <p className="my-1">Please try again.</p>
                </div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  required
                  autoFocus
                  id="email"
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={handleChange}
                  className="form-control bg-light" />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  required
                  id="password"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  className="form-control bg-light" />
              </div>
              <div className={passwordErrorText}>
                <p className="my-1">Your password must have 8 characters or more.</p>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small>
                  <a className={actionDisplay} href={actionHref}>
                    {actionText}
                  </a>
                </small>
                <button type="submit" className="btn dark-blue-button px-4" >
                  {submitButtonText}
                </button>
              </div>
              <div className="d-flex justify-content-between mt-2 mb-3">
                <small>
                  <a className={forgotPasswordLink} href={actionHref}>
                    {actionText}
                  </a>
                </small>
                <small>
                  <a className={forgotPasswordLink} href="#forgotPassword">
                    Forgot Password
                  </a>
                </small>
              </div>
              <div className="d-flex justify-content-center">
                <div className={demoDropdown}>
                  <a className="btn dropdown-toggle orange-button"
                    href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">View Sample Account
                  </a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item demo-button" id="therapist" onClick={this.handleClick}>Physical Therapist Account</a></li>
                    <li><a className="dropdown-item demo-button" id="patient" onClick={this.handleClick}>Patient Account</a></li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
AuthForm.contextType = AppContext;
