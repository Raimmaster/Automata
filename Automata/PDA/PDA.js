class PDA {
  constructor(states = [], alphabet = [], stackSymbols = [],
    transitionFunction = [], startState, initialPDSymbol, acceptanceStates = []){
      this.states = states;
      this.alphabet = alphabet;
      this.stackSymbols = stackSymbols;
      this.transitionFunction = transitionFunction;
      this.startState = startState;
      this.initialPDSymbol = initialPDSymbol;
      this.acceptanceStates = acceptanceStates;
      this.currentTransitionId = 0;
      this.currentStateId = 0;
      this.type = 'PDA';
      this.epsilon = 'epsilon';
  }

  addSymbolToAlphabet(symbol){
    this.alphabet.push(symbol);
  }

  setType(type){
    this.type = type;
  }

  addState(state, isAcceptance, isInitial){
    if(this.getStateByName(state) !== undefined){
      return 'undefined';
    }

    let newState = new PDAState(this.currentStateId++, state, [], isInitial, isAcceptance);

    if(isInitial){
      this.startState = newState;
    }

    this.states.push(newState);
    if(isAcceptance){
      this.acceptanceStates.push(newState);
    }

    return newState;
  }

  getStateByName(stateName){
    return this.states.find(state => state.stateName == stateName);
  }

  addTransition(fromState, toState, transitionSymbol, symbolOnTopOfStack, willPushSymbol, willPushBackTop){
    let originState = this.getStateByName(fromState);
    let destinyStateIndex = this.getStateByName(toState);

    if(transitionSymbol == "epsilon")
      transitionSymbol = '#';

    originState.addTransition(this.currentTransitionId++, originState, destinyState,
      transitionSymbol, symbolOnTopOfStack, willPushSymbol, willPushBackTop);
  }
}
