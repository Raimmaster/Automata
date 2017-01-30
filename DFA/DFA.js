class DFA{
  constructor(states = [], alphabet = [], transitionFunction = [], startState, acceptanceStates = []){
    this.states = states;
    this.alphabet = alphabet;
    this.transitionFunction = transitionFunction;
    this.startState = startState;
    this.acceptanceStates = acceptanceStates;
    this.currentState = 'undefined';
  }

  addSymbolToAlphabet(symbol){
    this.alphabet.push(symbol);
  }

  addState(state, isAcceptance, isInitial){
    let newState = new State(state);
    if(this.currentState === 'undefined'){
      this.currentState = newState;
    }

    if(isInitial){
      this.startState = newState;
    }

    this.states.push(newState);
    if(isAcceptance){
      this.acceptanceStates.push(newState.stateName);
    }
  }

  findStateByName(stateName){
    for(let index = 0; index < this.states.length; ++index){
      if(this.states[index].stateName === stateName){
        return index;
      }
    }

    return -1;
  }

  addTransition(fromState, toState, symbol){
    let indexOfOriginState = this.findStateByName(fromState);
    let destinyStateIndex = this.findStateByName(toState);
    this.states[indexOfOriginState].addTransition(symbol, this.states[destinyStateIndex]);
  }

  modifyState(state, newStateName){
    let indexOfState = this.findStateByName(state);
    if(indexOfState > -1){
      this.states[indexOfState].stateName = newStateName;
    }
  }

  deleteTransitionsToState(stateName){
    for(let stateIndex = 0; stateIndex < this.states.length; ++stateIndex){
      for(let transitionIndex = 0;
          transitionIndex < this.states[stateIndex].transitions.length;
          ++transitionIndex){
        if(this.states[stateIndex].transitions[transitionIndex].destinyState.stateName === stateName){
          this.states[stateIndex].transitions.splice(transitionIndex, 1);
          console.log("Deleted transitions");
        }
      }
    }
  }

  deleteState(state){
    let indexOfStateToDelete = this.findStateByName(state);
    if(indexOfStateToDelete > -1){
      console.log("Deleting state");
      this.deleteTransitionsToState(state);
      let indexOfAcceptanceState = this.acceptanceStates.indexOf(this.states[indexOfStateToDelete].stateName);
      if(indexOfAcceptanceState > -1){
        console.log("Deleting acceptance");
        this.acceptanceStates.splice(indexOfAcceptanceState, 1);
      }
      this.states[indexOfStateToDelete].transitions = [];
      this.states.splice(indexOfStateToDelete, 1);
    }
  }

  deleteTransition(transitionID){
    for(let i = 0; i < this.states.length; i++) {
      let state = this.states[i];
      for (let k = 0; k < state.transitions; k++) {
        let t = state.transitions[k];
        if (t.id === transitionId)
          state.transitions.splice(k, 1);
        }
    }
  }

  modifyTransition(transitionID, symbol){
    for(let i = 0; i < this.states.length; i++) {
      let state = this.states[i];
      for (let k = 0; k < state.transitions; k++) {
        let t = state.transitions[k];
        if (t.id === transitionId){
          t.symbol = symbol;
          t.transitionID = state.stateName + symbol;
        }
      }
    }
  }

  evaluate(evaluationString){
    let charArray = Array.from(evaluationString);
    this.currentState = this.startState;
    console.log("To evaluate: " + evaluationString);

    for(const currentChar of charArray){
      console.log("Current state: " + this.currentState);
      if(this.alphabet.includes(currentChar)){
        this.currentState = this.currentState.getNextState(currentChar);
        if(this.currentState === 'undefined'){
          return false;
        }
      }
    }

    return this.acceptanceStates.includes(this.currentState.stateName);
  }
}

// module.exports = DFA;
