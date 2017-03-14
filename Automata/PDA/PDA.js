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
    this.createPushGrammarEntries(cfgColl);

    return cfgColl;
  }

  createFirstGrammarEntry(cfgColl){
    if(this.type == 'pda'){
      this.grammarEntriesAddedFromStates(cfgColl, this.acceptanceStates);
    }else {
      this.grammarEntriesAddedFromStates(cfgColl, this.states);
    }
  }

  grammarEntriesAddedFromStates(cfgColl, states){
    let initialState = this.states.find(state => state.isInitial);
    let initialName = initialState.stateName;

    for(let state of states){
      let stateName = state.stateName;
      let production = 'S->[' + initialName + ' ' + this.initialPDSymbol + stateName + ']';
      cfgColl.addCfgProduction(production);
    }
  }

  createPopGrammarEntries(cfgColl){
    for(let state of this.states){
      let popTransitions = state.getPopTransitions();
      for(let trans of popTransitions){
        let transSymbol = trans.transitionSymbol;
        if(trans.transitionSymbol == '#'){
          transSymbol = 'epsilon'
        }
        let production = '[' + trans.originState.stateName +
          ' ' + trans.symbolOnTopOfStack + trans.destinyState.stateName +
          ']->' + transSymbol;
        cfgColl.addCfgProduction(production);
      }
    }
  }

  createPushGrammarEntries(cfgColl){
    for(let state of this.states){
      let nonEmptyTransitions = state.getNonEmptyTransitions();
      for(let trans of nonEmptyTransitions){
        let pushValueCount = trans.getStringLength();
        let permutationTable = this.getPermutation(pushValueCount);
        let m = permutationTable.length - 1;
        let transitionString = trans.getTransitionString();
        for(let i = 0; i < permutationTable.length; ++i){
          let production = '';
          //LHS value: nonterminal
          let mIndex = permutationTable[i].length - 1;
          production = '[' + state.stateName + ' ' + trans.symbolOnTopOfStack +
            permutationTable[i][mIndex] + ']->' + trans.transitionSymbol;

          //first production concat
          production += '[' + state.stateName + ' ' + transitionString[0] +
            permutationTable[i][0] + ']';

          //subsequent production concats
          for(let k = 0; k <  pushValueCount - 1; ++k){
            console.log("Middle one.");
            production += '[' + permutationTable[i][k] + ' ' +
              transitionString[k] + permutationTable[i][k+1] + ']';
          }
          cfgColl.addCfgProduction(production);
          console.log("Three step production: " + production);
        }
      }
    }
  }

  getPermutation(pushValueCount){
    let amountOfStates = this.states.length;
    let rowsCount = Math.pow(amountOfStates, pushValueCount);
    let stateNames = this.states.map(state => state.stateName);

    let table = [];
    for(let i = 0; i < rowsCount; ++i){
      table.push([]);
      for(let k = 0; k < pushValueCount; ++k){
        table[i].push("");
      }
    }

    for(let i = 0; i < pushValueCount; ++i){
      let incidences = Math.pow(amountOfStates, pushValueCount - (i+1));
      let currentStateIndex = 0;
      for(let k = 0; k < rowsCount; ++k){
        if(k > 0 && k % incidences == 0){
          ++currentStateIndex;
        }

        if(currentStateIndex >= amountOfStates){
          currentStateIndex = 0;
        }

        table[k][i] = stateNames[currentStateIndex];
      }
    }
    console.log("The table: ");
    console.log(table);
    return table;
  }
}
