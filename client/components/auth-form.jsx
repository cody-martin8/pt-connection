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
      error: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    fetch('/api/forgot-password', {
      method: 'POST'
    });
    // Add .then for displaying 'Email Sent' notification.
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
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
          this.setState({ error: true });
        } else {
          this.setState({ error: false });
        }
      });
  }

  render() {
    const { action } = this.props;
    const { handleChange, handleSubmit } = this;
    const { error } = this.state;
    const actionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const actionText = action === 'sign-up'
      ? 'Sign in instead'
      : 'Register now';
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    const accountTypeDropdown = action === 'sign-up'
      ? 'mb-3'
      : 'd-none';
    const patientIdInput = this.state.accountType === 'patient'
      ? 'mb-3'
      : 'd-none';
    const errorText = error
      ? 'alert alert-danger py-2 mb-3'
      : 'd-none';
    return (
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
        <div className={accountTypeDropdown}>
          <label htmlFor="accountType" className="form-label">
            Account Type
          </label>
          <select
            required
            id="accountType"
            name="accountType"
            onChange={handleChange}
            defaultValue="default"
            className="form-select">
            <option value="default" disabled>Select Account Type</option>
            <option value="therapist">Physical Therapist</option>
            <option value="patient">Patient</option>
          </select>
        </div>
        <div className={patientIdInput}>
          <label htmlFor="patientId" className="form-label">
            Patient Id
          </label>
          <input
            id="patientId"
            name="patientId"
            onChange={handleChange}
            className="form-control bg-light" />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small>
            <a className="text-muted" href={actionHref}>
              {actionText}
            </a>
          </small>
          <button className="btn" style={{ backgroundColor: '#FFC857', color: 'white' }} onClick={this.handleClick}>
            Send Email
            {/* Reformat to a Forgot Password button */}
          </button>
          <button type="submit" className="btn" style={{ backgroundColor: '#282A3E', color: 'white' }}>
            {submitButtonText}
          </button>
        </div>
      </form>
    );
  }
}
AuthForm.contextType = AppContext;
