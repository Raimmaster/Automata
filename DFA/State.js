// let Transition = require('./Transition');

class State{
  constructor(stateName, transitions = []){
    this.stateName = stateName;
    this.transitions = transitions;
    this.amountOfTransitions = 0;
  }

  addTransition(symbol, destinyState){
    let newTransitionId = this.stateName + symbol;
    this.amountOfTransitions++;
    let newTransition = new Transition(newTransitionId, symbol, destinyState);
    this.transitions.push(newTransition);
  }

  getNextState(symbol){
    let transitionToFind = this.stateName + symbol;
    let indexOfTransition = this.transitions.indexOf(transitionToFind);
    if(indexOfTransition > -1){
      let nextState = this.transitions[indexOfTransition].destinyState;

      return nextState;
    }

    return 'undefined';
  }
}

// module.exports = State;
