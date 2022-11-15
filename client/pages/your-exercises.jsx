import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import ExerciseCards from '../components/exercise-cards';

export default class YourExercises extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      targetArea: 'All',
      isLoading: true,
      networkError: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    switch (event.target.id) {
      case 'all':
        this.setState({ targetArea: 'All' });
        break;
      case 'ankleAndFoot':
        this.setState({ targetArea: 'Ankle and Foot' });
        break;
      case 'cervical':
        this.setState({ targetArea: 'Cervical' });
        break;
      case 'elbowAndHand':
        this.setState({ targetArea: 'Elbow and Hand' });
        break;
      case 'hipAndKnee':
        this.setState({ targetArea: 'Hip and Knee' });
        break;
      case 'lumbarThoracic':
        this.setState({ targetArea: 'Lumbar Thoracic' });
        break;
      case 'shoulder':
        this.setState({ targetArea: 'Shoulder' });
        break;
      case 'other':
        this.setState({ targetArea: 'Other' });
        break;
      default:
        this.setState({ targetArea: 'All' });
    }
  }

  componentDidMount() {
    fetch('/api/exercises', {
      headers: {
        'X-Access-Token': this.context.token
      }
    })
      .then(res => res.json())
      .then(exercises => this.setState({ exercises, isLoading: false }))
      .catch(error => {
        if (error) {
          this.setState({
            isLoading: false,
            networkError: true
          });
        }
      });
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    const { targetArea, exercises, isLoading, networkError } = this.state;

    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center mt-5 load-container">
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

    for (let i = 0; i < exercises.length; i++) {
      targetArea === 'All'
        ? exercises[i].view = 'd-block mb-3'
        : exercises[i].targetArea === targetArea
          ? exercises[i].view = 'd-block mb-3'
          : exercises[i].view = 'd-none';
    }

    return (
      <div className="container px-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 mb-4 mb-lg-4 p-0 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <h1 className="me-3">Your Exercises</h1>
              <i className="fa-regular fa-folder-open fa-2xl mb-1 d-none d-sm-block"></i>
            </div>
            <a href="#newExercise" className="btn dark-blue-button">New Exercise</a>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-7 mb-4 p-lg-1 d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <h4 className="me-3">{targetArea} Exercises</h4>
            </div>
            <div className="dropdown">
              <a className="btn dropdown-toggle orange-button"
                href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">Target Area</a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#exercises" id="all" onClick={this.handleClick}>All</a></li>
                <li><a className="dropdown-item" href="#exercises" id="ankleAndFoot" onClick={this.handleClick}>Ankle and Foot</a></li>
                <li><a className="dropdown-item" href="#exercises" id="cervical" onClick={this.handleClick}>Cervical</a></li>
                <li><a className="dropdown-item" href="#exercises" id="elbowAndHand" onClick={this.handleClick}>Elbow and Hand</a></li>
                <li><a className="dropdown-item" href="#exercises" id="hipAndKnee" onClick={this.handleClick}>Hip and Knee</a></li>
                <li><a className="dropdown-item" href="#exercises" id="lumbarThoracic" onClick={this.handleClick}>Lumbar Thoracic</a></li>
                <li><a className="dropdown-item" href="#exercises" id="shoulder" onClick={this.handleClick}>Shoulder</a></li>
                <li><a className="dropdown-item" href="#exercises" id="other" onClick={this.handleClick}>Other</a></li>
              </ul>
            </div>
          </div>
          <div className="row justify-content-center mb-5">
            <ExerciseCards exercises={exercises} />
          </div>
        </div>
      </div>
    );
  }
}
YourExercises.contextType = AppContext;
