// let State = require('./State');

class DFA{
  constructor(states = [], alphabet, transitionFunction = [], startState, acceptanceStates = []){
    this.states = states;
    this.alphabet = alphabet;
    this.transitionFunction = transitionFunction;
    this.startState = startState;
    this.acceptanceStates = acceptanceStates;
    this.currentState = 'undefined';
  }

  addState(state){
    let newState = new State(state);
    if(this.currentState === 'undefined'){
      this.currentState = newState;
    }
    this.states.push(newState);
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

  evaluate(evaluationString){
    let charArray = Array.from(evaluationString);
    if(this.currentState !== 'undefined'){
      this.currentState = this.states[0];
      for(const currentChar of charArray){
        if(this.alphabet.includes(currentChar)){
          this.currentState = this.currentState.getNextState(currentChar);
          if(this.currentState === 'undefined'){
            return false;
          }
        }
      }
    }
    return this.acceptanceStates.includes(this.currentState.stateName);
  }
}

// module.exports = DFA;
