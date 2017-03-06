class PDA {
  constructor(states = [], alphabet = [], stackSymbols = [],
    transitionFunction = [], startState, initialPDSymbol,
    acceptanceStates = []){
      this.states = states;
      this.alphabet = alphabet;
      this.stackSymbols = stackSymbols;
      this.transitionFunction = transitionFunction;
      this.startState = startState;
      this.initialPDSymbol = initialPDSymbol;
      this.acceptanceStates = acceptanceStates;
      this.currentTransitionId = 0;
      this.currentStateId = 0;
      this.type = 'pda';
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

  addTransition(fromState, toState, transitionSymbol,
    symbolOnTopOfStack, willPushSymbol, willPushBackTop){
    let originState = this.getStateByName(fromState);
    let destinyState = this.getStateByName(toState);

    if(transitionSymbol == "epsilon")
      transitionSymbol = '#';

    return originState.addTransition(this.currentTransitionId++, originState, destinyState,
      transitionSymbol, symbolOnTopOfStack, willPushSymbol, willPushBackTop);
  }

  evaluate(evaluationString){
    let stack = [this.initialPDSymbol];
    return this.evalPDA(evaluationString, this.startState, stack);
  }

  removeDuplicatesInTupleSet(stateTuplesSet){
    for(let stateTuple of stateTuplesSet){

    }
  }

  evalPDA(evaluationString, initialState, stack){
    console.log("The eval string: " + evaluationString);
    let stateTuplesArr = [];
    let arrayOfPasses = [];

    let closureTuples = new Set();
    closureTuples = initialState.getClosure(closureTuples, stack);

    if(evaluationString.length === 0){
      for(let tuple of closureTuples){
        if(this.acceptanceStates.includes(tuple.destinyState)){
          return true;
        }
      }

      return false;
    }

    let currChar = evaluationString[0];
    if(!this.alphabet.includes(currChar)){
      return false;
    }

    stateTuplesArr = initialState.getNextStates(currChar, stack);
    let stateTuplesSet = new Set();
    stateTuplesArr.forEach( transTuple => stateTuplesSet.add(transTuple));
    // stateTuplesSet = this.removeDuplicatesInTupleSet(stateTuplesSet);
    for(let tupleOfClosure of closureTuples){
      let tupleState = tupleOfClosure.destinyState;
      // console.log("Current stack for closure: ");
      // console.log(tupleOfClosure.stack);
      stateTuplesArr = tupleState.getNextStates(currChar, tupleOfClosure.stack);
      stateTuplesArr.forEach(x => stateTuplesSet.add(x));
    }
    // console.log("The s tup set: ");
    // console.log(stateTuplesSet);
    if(stateTuplesSet.size < 1){
      return false;
    }
    // console.log("I got here, with length: " + evaluationString.length);
    if(evaluationString.length === 1){
      return this.checkFinalEpsilonChar(stateTuplesSet);
    }else{
      let newEvalString = evaluationString.slice(1, evaluationString.length);
      // console.log("States tuple set: ");
      // console.log(stateTuplesSet);
      for(let currTuple of stateTuplesSet){
        // console.log("Before array of passes, the stack for state: " + currTuple.destinyState.stateName);
        // console.log(currTuple.stack);
        // console.log("That was the stack.");
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
      let closureTuples = tupleOf.destinyState.getClosure(new Set(), tupleOf.stack);
      for(let tuple of closureTuples){
        if(this.acceptanceStates.includes(tuple.destinyState)){
          return true;
        }
      }
    }

    return false;
  }
}
