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

  addSymbolToAlphabet(symbol){
    this.alphabet.push(symbol);
  }

  setType(type){
    this.type = type;
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

    return originState.addTransition(this.currentTransitionId++, destinyState, 
      symbol, newSymbol, direction);
  }

  //returns index
  findStateByName(stateName){
    for(let index = 0; index < this.states.length; ++index){
      if(this.states[index].stateName === stateName){
        return index;
      }
    }

    return -1;
  }

  getStateByName(stateName){
    return this.states.find(state => state.stateName == stateName);
  }

  evaluate(evalString){
    let stringTape = new Tape(evalString);
    let currentState = this.startState;
    console.log(stringTape.originalString);
    while(true){
      console.log(currentState);
      console.log(stringTape.tape);
      currentState = currentState.getNextState(stringTape);
      
      if(currentState == undefined){
        return false;
      }

      if(stringTape.noMoreCursorMovement){
        break;
      }
    }

    return currentState.isAcceptance;
  }
}
