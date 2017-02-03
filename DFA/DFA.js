class DFA {
  constructor(states = [], alphabet = [], transitionFunction = [], startState, acceptanceStates = []){
    this.states = states;
    this.alphabet = alphabet;
    this.transitionFunction = transitionFunction;
    this.startState = startState;
    this.acceptanceStates = acceptanceStates;
    this.currentState = 'undefined';
    this.currentTransitionId = 0;
    this.currentStateId = 0;
  }

  addSymbolToAlphabet(symbol){
    this.alphabet.push(symbol);
  }

  addState(state, isAcceptance, isInitial){
    let newState = new State(this.currentStateId++, state, []);
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
    let originState = this.states[indexOfOriginState];
    originState.addTransition(this.currentTransitionId++, symbol, originState, this.states[destinyStateIndex]);
  }

  modifyState(state, newStateName){
    let indexOfState = this.findStateByName(state);
    if(indexOfState > -1){
      this.states[indexOfState].stateName = newStateName;
      console.log("State modified");
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
      for (let k = 0; k < state.transitions.length; k++) {
        let t = state.transitions[k];
        if (t.transitionID == transitionID){
          alert("Eliminando");
          this.states[i].transitions.splice(k, 1);
          return;
        }
      }
    }
  }

  modifyTransition(transitionID, symbol){
      for(let i = 0; i < this.states.length; i++) {
      let state = this.states[i];
      for (let k = 0; k < state.transitions.length; k++) {
        let t = state.transitions[k];
        if (t.transitionID == transitionID){
          t.symbol = symbol;
          return;
        }
      }
    }
  }

  evaluate(evaluationString){
    let charArray = Array.from(evaluationString);
    this.currentState = this.startState;
    console.log("To evaluate: " + evaluationString);

    for(const currentChar of charArray){
      console.log("Current state: " + this.currentState.stateName);
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
