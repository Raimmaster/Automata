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

  modifyState(state, newStateName){
    let indexOfState = this.states.indexOf(state);
    if(indexOfState > -1){
      this.states[indexOfState] = newStateName;
    }
  }

  deleteState(state){
    let indexOfStateToDelete = this.states.indexOf(state);
    if(indexOfStateToDelete > -1){      
      this.states[indexOfStateToDelete].transitions = [];
      deleteTransitionsToState(state.stateName);
    }
  }

  deleteTransitionsToState(stateName){
    for(const[stateIndex, state] of this.states.entries()){
      for(const[transitionIndex, transition] of state.transitions.entries()){
        if(transition.destinyState === stateName){
          state.transitions.splice(transitionIndex, 1);
        }
      }
    }
  }

  deleteTransition(transitionID){
    let indexOfTransitionToDelete = this.originState.transitions.indexOf(transitionID);
    if(indexOfTransitionToDelete > -1){
      this.originState.transitions.splice(indexOfTransitionToDelete, 1);
    }
  }

  modifyTransition(transitionID, symbol){
    let indexOfTransitionToModify = this.originState.transitions.indexOf(transitionID);
    if(indexOfTransitionToModify > -1){
      this.originState.transitions[indexOfTransitionToModify] = symbol;
    }
  }
}

module.exports = DFA;
