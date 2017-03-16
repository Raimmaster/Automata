class Turing {
  constructor(states = [], alphabet = [], startState, acceptanceStates = []){
    this.states = states;
    this.alphabet = alphabet;
    this.startState = startState;
    this.acceptanceStates = acceptanceStates;
    this.currentTransitionId = 0;
    this.currentStateId = 0;
    this.epsilon = 'ε';
    this.emptyValue = 'β';
    this.type = "turing";
  }

  addState(stateName, isAcceptance, isInitial){
    if(this.getStateByName(stateName) !== undefined){
      return undefined;
    }

    let newState = new TuringState(this.currentStateId++, stateName,
      isInitial, isAcceptance);
    if(isInitial){
      this.startState = newState;
    }

    if(isAcceptance){
      this.acceptanceStates = newState;
    }

    this.states.push(newState);

    return newState;
  }

  addTransition(originStateName, destinyStateName, symbol, newSymbol, direction){
    let originState = this.getStateByName(originStateName);
    let destinyState = this.getStateByName(destinyStateName);

    if(symbol == "epsilon"){
      symbol = '#';
    }else if(symbol == "empty"){
      symbol = this.emptyValue;
    }

    if(newSymbol == "epsilon"){
      newSymbol = '#';
    }else if(newSymbol == "empty"){
      newSymbol = emptyValue;
    }

    return originState.addTransition(this.currentTransitionId++, destinyState, symbol, newSymbol, direction);
  }

  getStateByName(stateName){
    return this.states.find(state => state.stateName == stateName);
  }

  evaluate(evalString){
    let stringTape = new Tape(evalString);
    let currentState = this.startState;
    while(true){
      currentState = currentState.getNextState(stringTape);
      if(stringTape.noMoreCursorMovement){
        break;
      }
    }

    return currentState.isAcceptance;
  }
}
