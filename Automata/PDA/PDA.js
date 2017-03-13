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
      this.grammarCollection = null;
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
    symbolOnTopOfStack, production, willPushSymbol, willPushBackTop){
    let originState = this.getStateByName(fromState);
    let destinyState = this.getStateByName(toState);

    if(transitionSymbol == "epsilon")
      transitionSymbol = '#';

    return originState.addTransition(this.currentTransitionId++, originState, destinyState,
      transitionSymbol, symbolOnTopOfStack, production, willPushSymbol, willPushBackTop);
  }

  evaluate(evaluationString){
    let stack = [this.initialPDSymbol];
    if(this.type == 'pda'){
      return this.evalPDA(evaluationString, this.startState, stack);
    }else {
      stack.pop();
      if(this.grammarCollection != null){
        stack.push(this.grammarCollection[0].nonterminalSymbol);
      }else {
        stack.push('z0-p');
      }
      return this.evalEmptyPDA(evaluationString, this.startState, stack);
    }
  }

  evalEmptyPDA(evaluationString, initialState, stack){
    let stateTuplesArr = [];
    let arrayOfPasses = [];

    let closureTuples = new Set();
    closureTuples = initialState.getClosure(closureTuples, stack);

    if(evaluationString.length === 0){
      return stack.length === 0 || (stack.length === 1 && stack[0] == 'z0-p');
    }

    let currChar = evaluationString[0];
    if(!this.alphabet.includes(currChar)){
      return false;
    }

    stateTuplesArr = initialState.getNextStates(currChar, stack);
    let stateTuplesSet = new Set();
    stateTuplesArr.forEach(transTuple => stateTuplesSet.add(transTuple));
    for(let tupleOfClosure of closureTuples){
      let tupleState = tupleOfClosure.destinyState;
      stateTuplesArr = tupleState.getNextStates(currChar, tupleOfClosure.stack);
      stateTuplesArr.forEach(x => stateTuplesSet.add(x));
    }
    if(stateTuplesSet.size < 1){
      return false;
    }
    let newEvalString = evaluationString.slice(1, evaluationString.length);
    for(let currTuple of stateTuplesSet){
      arrayOfPasses.push(this.evalEmptyPDA(newEvalString,
        currTuple.destinyState, currTuple.stack));
    }

    return arrayOfPasses.includes(true);
  } 

  evalPDA(evaluationString, initialState, stack){
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
    for(let tupleOfClosure of closureTuples){
      let tupleState = tupleOfClosure.destinyState;
      stateTuplesArr = tupleState.getNextStates(currChar, tupleOfClosure.stack);
      stateTuplesArr.forEach(x => stateTuplesSet.add(x));
    }
    if(stateTuplesSet.size < 1){
      return false;
    }
    if(evaluationString.length === 1){
      return this.checkFinalEpsilonChar(stateTuplesSet);
    }else{
      let newEvalString = evaluationString.slice(1, evaluationString.length);
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
      let closureTuples = tupleOf.destinyState.getClosure(new Set(), tupleOf.stack);
      for(let tuple of closureTuples){
        if(this.acceptanceStates.includes(tuple.destinyState)){
          return true;
        }
      }
    }

    return false;
  }

  convertEmptyPdaToCFG(){
    let cfgColl = new CfgCollection(this.alphabet);
    this.createFirstGrammarEntry(cfgColl);
    this.createPopGrammarEntries(cfgColl);
    //this.createPushGrammarEntries(cfgColl);

    return cfgColl;
  }

  createFirstGrammarEntry(cfgColl){
    let initialState = this.states.find(state => state.isInitial);
    let initialName = initialState.stateName;
    for(let state of this.states){
      let stateName = state.stateName;
      let production = 'S->[' + initialName + ' ' + this.initialPDSymbol + stateName + ']';
      cfgColl.addCfgProduction(production);
    }
  }

  createPopGrammarEntries(cfgColl){
    for(let state of this.states){
      let popTransitions = state.getPopTransitions();
      for(let trans of popTransitions){
        let production = '[' + trans.originState.stateName +
          ' ' + trans.symbolOnTopOfStack + trans.destinyState.stateName +
          ']->' + trans.transitionSymbol;
        cfgColl.addCfgProduction(production);
      }
    }
  }

}
