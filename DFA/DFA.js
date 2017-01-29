class DFA{
  constructor(states = [], alphabet, transitionFunctions = [], startState, acceptanceStates = []){
    this.states = states;
    this.alphabet = alphabet;
    this.transitionFunction = transitionFunction;
    this.startState = startState;
    this.finalStates = finalStates;
  }

  addState(state){
    this.states.push(state);
  }

  addTransition(fromState, toState, symbol){
    let indexOfTransition = this.states.indexOf(fromState);
    this.states[indexOfTransition].addTransition(symbol, toState);
  }

  deleteState(state){
    let indexOfStateToDelete = this.states.indexOf(state);
    if(indexOfStateToDelete > -1){
      this.states.splice(indexOfStateToDelete, 1);
    }
  }

  deleteTransition(originState, destinyState){
    let indexOfTransitionToDelete = this.originState.transitions.indexOf(destinyState);
    if(indexOfTransitionToDelete > -1){
      this.originState.transitions.splice(indexOfTransitionToDelete, 1);
    }
  }

  modifyTransition(originState, destinyState, symbol){
    let indexOfTransitionToModify = this.originState.transitions.indexOf(destinyState);
    if(indexOfTransitionToModify > -1){
      this.originState.transitions[indexOfTransitionToModify] = symbol;
    }
  }
}

module.exports = DFA;
