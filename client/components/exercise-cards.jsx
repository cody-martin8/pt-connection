import React from 'react';

export default class ExerciseCards extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercises: [],
      targetArea: 'All'
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const view = event.target.id;
    switch (view) {
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
    fetch('/api/exercises')
      .then(res => res.json())
      .then(exercises => this.setState({ exercises }));
  }

  render() {
    const targetArea = this.state.targetArea;
    const exercises = this.state.exercises;

    for (let i = 0; i < exercises.length; i++) {
      targetArea === 'All'
        ? exercises[i].view = 'd-block mb-3'
        : exercises[i].targetArea === targetArea
          ? exercises[i].view = 'd-block mb-3'
          : exercises[i].view = 'd-none';
    }

    return (
      <div className="row justify-content-center">
        <div className="col-12 col-lg-7 col-xl-7 col-xxl-5 mb-3 p-lg-1 d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <h4 className="me-3">{ targetArea } Exercises</h4>
            {/* <i className="fa-solid fa-users fa-2xl mb-2"></i> */}
          </div>
          <div className="dropdown">
            <a className="btn dropdown-toggle" style={{ backgroundColor: '#D78521', color: 'white' }}
               href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
              Target Area
            </a>

            <ul className="dropdown-menu">
              <li><a className="dropdown-item" href="#exercises" id="all" onClick={ this.handleClick }>All</a></li>
              <li><a className="dropdown-item" href="#exercises" id="ankleAndFoot" onClick={ this.handleClick }>Ankle and Foot</a></li>
              <li><a className="dropdown-item" href="#exercises" id="cervical" onClick={ this.handleClick }>Cervical</a></li>
              <li><a className="dropdown-item" href="#exercises" id="elbowAndHand" onClick={ this.handleClick }>Elbow and Hand</a></li>
              <li><a className="dropdown-item" href="#exercises" id="hipAndKnee" onClick={ this.handleClick }>Hip and Knee</a></li>
              <li><a className="dropdown-item" href="#exercises" id="lumbarThoracic" onClick={ this.handleClick }>Lumbar Thoracic</a></li>
              <li><a className="dropdown-item" href="#exercises" id="shoulder" onClick={ this.handleClick }>Shoulder</a></li>
              <li><a className="dropdown-item" href="#exercises" id="other" onClick={ this.handleClick }>Other</a></li>
            </ul>
          </div>
        </div>
        <ul style={{ listStyle: 'none' }}>
          {
            this.state.exercises.map(exercise => (
              <li key={exercise.exerciseId} className={ exercise.view }>
                <Exercise exercise={exercise} />
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

function Exercise(props) {
  const { name } = props.exercise;

  return (
    <div className="card mx-auto col-lg-7 col-xl-7 col-xxl-5">
      <div className="card-body ms-3 d-flex justify-content-start">
        <h5>{ name }</h5>
      </div>
    </div>
  );
}