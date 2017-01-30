// let Transition = require('./Transition');

class State{
  constructor(stateName, transitions = []){
    this.stateName = stateName;
    this.transitions = transitions;
  }

  addTransition(symbol, destinyState){
    let newTransitionId = this.stateName + symbol;
    let newTransition = new Transition(newTransitionId, symbol, destinyState);
    this.transitions.push(newTransition);
  }

  findTransitionByName(transitionID){
    for(let index = 0; index < this.transitions.length; ++index){
      if(this.transitions[index].transitionID === transitionID){
        return index;
      }
    }

    return -1;
  }

  getNextState(symbol){
    let transitionToFind = this.stateName + symbol;
    let indexOfTransition = this.findTransitionByName(transitionToFind);
    if(indexOfTransition > -1){
      let nextState = this.transitions[indexOfTransition].destinyState;

      return nextState;
    }

    return 'undefined';
  }
}

// module.exports = State;
