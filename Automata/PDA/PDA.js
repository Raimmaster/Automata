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

  evaluate(evaluationString){
    let stack = ['z0'];
    return this.evalPDA(evaluationString, this.startState, stack);
  }

  evalPDA(evaluationString, initialState, stack){
    let stateTuplesArr = [];
    let arrayOfPasses = [];

    let closureTuples = new Set();
    //When getting closure, do necessary pops or pushes
    closureTuples = initialState.getClosure(closureTuples, stack);

    if(evalString.length === 0){
      for(let tuple of closureTuples){
        return this.acceptanceStates.includes(tuple.destinyState);
      }
    }

    let currChar = evaluationString[0];
    if(!this.alphabet.includes(currChar)){
      return false;
    }

    //this is where the transitions are checked; thus, with each transition
    //check for necessary pops and pushes
    stateTuplesArr = initialState.getNextStates(currChar, stack);
    let stateTuplesSet = new Set();
    stateTuplesArr.forEach( transTuple => stateTuplesSet.add(transTuple));

    for(let tupleOfClosure of closureTuples){
      //again, for each closure state gotten above, when doing the transitions
      //check for necessary pops and pushes
      stateTuplesArr = tupleOfClosure.getNextStates(currChar, stack);
      stateTuplesArr.forEach(x => stateTuplesSet.add(x));
    }

    if(stateTuplesSet.size < 1){
      return false;
    }

    if(evalString.length === 1){
      return this.checkFinalEpsilonChar(stateTuplesSet);
    }else{
      let newEvalString = evalString.slice(1, evalString.length);
      for(let currTuple of stateTuplesSet){
        arrayOfPasses.push(this.evalPDA(newEvalString,
          currTuple.destinyState, currTuple.stack));
      }
    }

    return arrayOfPasses.includes(true);
  }

  checkFinalEpsilonChar(states){
    for(let tupleOf of states){
      if(this.acceptanceStates.includes(tupleOf.destinyState)){
        return true;
      }
      //check for necessary pops and pushes
      let closureTuples = tupleOf.getClosure(new Set(), tupleOf.stack);
      for(let tuple of closureTuples){
        if(this.acceptanceStates.includes(tuple.destinyState)){
          return true;
        }
      }
    }

    return false;
  }
}
