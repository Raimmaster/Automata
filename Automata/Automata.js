class Automata {
  constructor(states = [], alphabet = [], transitionFunction = [], startState, acceptanceStates = []){
    this.states = states;
    this.alphabet = alphabet;
    this.transitionFunction = transitionFunction;
    this.startState = startState;
    this.acceptanceStates = acceptanceStates;
    this.currentState = 'undefined';
    this.currentTransitionId = 0;
    this.currentStateId = 0;
    this.type = 'DFA';
    this.epsilon = 'epsilon';
  }

  addSymbolToAlphabet(symbol){
    this.alphabet.push(symbol);
  }

  setType(type){
    this.type = type;
    if(type == "NFA-epsilon"){
      this.alphabet.push('#'); //used for epsilon for now
    }
  }

  addState(state, isAcceptance, isInitial){
    let newState = new State(this.currentStateId++, state, [], isInitial, isAcceptance);
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
  //returns index
  findStateByName(stateName){
    for(let index = 0; index < this.states.length; ++index){
      if(this.states[index].stateName === stateName){
        return index;
      }
    }

    return -1;
  }
  //returns object
  getStateByName(stateName){
    for(let state of this.states){
      if(state.stateName === stateName){
        return state;
      }
    }

    return 'undefined';
  }

  addTransition(fromState, toState, symbol){
    let indexOfOriginState = this.findStateByName(fromState);
    let destinyStateIndex = this.findStateByName(toState);
    let originState = this.states[indexOfOriginState];
    if(symbol == "epsilon")
      symbol = '#';
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

  evalAutomata(evalString, initialState){
    let states = [];
    let arrayOfPasses = [];

      let currChar = evalString[0];
      if(!this.alphabet.includes(currChar)){
        return false;
      }

      states = initialState.getNextStates(currChar);

      if(states.length < 1){
        return false;
      }

      if(evalString.length === 1){
        for(let index = 0; index < states.length; ++index){
          let aState = states[index];
          if(this.acceptanceStates.includes(aState.stateName))
          {
            return true;
          }
        }
      }else{
        let newEvalString = evalString.slice(1, evalString.length);
        for(let sIndex = 0; sIndex < states.length; ++sIndex) {
          let currState = states[sIndex];
          arrayOfPasses.push(this.evalAutomata(newEvalString, currState));
        }
      }

    return arrayOfPasses.includes(true);
  }

  evalEpsilon(evalString, initialState){
    let statesArr = [];
    let arrayOfPasses = [];

    let closureStates = new Set();
    closureStates = initialState.getClosure(closureStates);

    if(evalString.length === 0){
      for(let aState of closureStates){
        console.log("Got here with " + aState.stateName);
        if(this.acceptanceStates.includes(aState.stateName)){
          return true;
        }
      }
    }

    let currChar = evalString[0];
    if(!this.alphabet.includes(currChar)){
      return false;
    }
    statesArr = initialState.getNextStates(currChar);
    let states = new Set();
    statesArr.forEach(function (item){
      states.add(item);
    });

    for(let stateOfClosure of closureStates){
      statesArr = stateOfClosure.getNextStates(currChar);
      statesArr.forEach(function (item){
        states.add(item);
      });
    }

    if(states.size < 1){
      return false;
    }

    if(evalString.length === 1 ){
      for(let aState of states){
        if(this.acceptanceStates.includes(aState.stateName)){
          return true;
        }
        closureStates = aState.getClosure(new Set());
        for(let aState of closureStates){
          if(this.acceptanceStates.includes(aState.stateName)){
            return true;
          }
        }
      }

    }
    else{
      let newEvalString = evalString.slice(1, evalString.length);
      for(let currState of states) {
        arrayOfPasses.push(this.evalEpsilon(newEvalString, currState));
      }
    }

    return arrayOfPasses.includes(true);
  }

  evaluate(evaluationString){
    if(this.type != "nfa-epsilon")
      return this.evalAutomata(evaluationString, this.startState);
    else {
      return this.evalEpsilon(evaluationString, this.startState);
    }
  }

  addToStateDataSet(automaton, stateName, isInitialState, isAcceptanceState, stateId, setIdManual){
    let borderColor = '';
    let stateColor = '';

    if(isInitialState){
      stateColor = '#58FA82';
      borderColor = '#FE2E2E';
    }

    if(isAcceptanceState){
      stateColor = '#FFBF00';
    }

    let currentStateId = setIdManual ? stateId : automaton.currentStateId;
    console.log("State:");
    console.log(currentStateId);
    states.add({
          id: currentStateId,
          label: stateName,
          color: {
            border: borderColor,
            background: stateColor
          }
    });
  }

  resetDataStates(){
    states.clear();
    transitions.clear();
    alphabet.clear();
  }

  transformNfaToDfa(){
    this.resetDataStates();
    let dfaAutomaton = new Automata([], [], [], [], []);
    dfaAutomaton.currentStateId = this.currentStateId;
    dfaAutomaton.currentTransitionId = this.currentTransitionId;
    //Copy alphabet
    this.alphabet.forEach(function(item, index, array){
      dfaAutomaton.addSymbolToAlphabet(item);
      alphabet.add({
        id: item,
        symbol: item
      });
    });

    let currentState = this.startState;

    let statesToCheck = [];
    let isAcceptanceState = this.acceptanceStates.includes(this.startState.stateName);

    this.addToStateDataSet(dfaAutomaton, this.startState.stateName, true, isAcceptanceState);
    dfaAutomaton.addState(currentState.stateName, isAcceptanceState, true);

    //Get states from start state
    for(const currChar of this.alphabet){
      let statesFromSymbol = currentState.getNextStates(currChar);
      if(statesFromSymbol.length < 1) {
        continue;
      }
      statesFromSymbol.sort(this.compareStatesByName);

      let containsAnAcceptanceState = false;
      let pastAcceptanceStates = this.acceptanceStates;
      statesFromSymbol.forEach(function(item){
        containsAnAcceptanceState = pastAcceptanceStates.includes(item.stateName);
      });

      let dfaStateName = this.joinStateNames(statesFromSymbol);
      this.addToStateDataSet(dfaAutomaton, dfaStateName, false, containsAnAcceptanceState);
      dfaAutomaton.addState(dfaStateName, false, containsAnAcceptanceState);

      let indexOfNewState = dfaAutomaton.findStateByName(dfaStateName);
      let newState = dfaAutomaton.states[indexOfNewState];
      newState.setOfNfaStates = statesFromSymbol;

      this.addToTransitionDataSet(dfaAutomaton, currentState.stateName, dfaStateName, currChar);
      dfaAutomaton.addTransition(currentState.stateName, dfaStateName, currChar);
      statesToCheck.push(newState);
    }

    currentState = statesToCheck[0];
    //create dfa table from the past states
    while(statesToCheck.length > 0){

      for(const currChar of this.alphabet){
        let currentStatesTransSet = new Set();

        for(let nfaStateIndex = 0; nfaStateIndex < currentState.setOfNfaStates.length; ++nfaStateIndex){
          let statesFromSymbol = currentState.setOfNfaStates[nfaStateIndex].getNextStates(currChar);
          if(statesFromSymbol.length < 1) {
            continue;
          }
          statesFromSymbol.sort(this.compareStatesByName);
          statesFromSymbol.forEach(function(item){
            currentStatesTransSet.add(item)
          });
        }

        let statesFromSet = Array.from(currentStatesTransSet);
        if(statesFromSet.length < 1){
          continue;
        }
        let dfaStateName = this.joinStateNames(statesFromSet);
        let indexOfNewState = dfaAutomaton.findStateByName(dfaStateName);
        if(indexOfNewState < 0){
          let containsAnAcceptanceState = false;
          let pastAcceptanceStates = this.acceptanceStates;
          statesFromSet.forEach(function(item){
            containsAnAcceptanceState = pastAcceptanceStates.includes(item.stateName);
            if(containsAnAcceptanceState)
              return;
          });

          this.addToStateDataSet(dfaAutomaton, dfaStateName, false, containsAnAcceptanceState);
          dfaAutomaton.addState(dfaStateName, containsAnAcceptanceState, false);
          indexOfNewState = dfaAutomaton.states.length - 1;

          let newState = dfaAutomaton.states[indexOfNewState];
          newState.setOfNfaStates = statesFromSet;
          statesToCheck.push(newState);
        }

        this.addToTransitionDataSet(dfaAutomaton, currentState.stateName, dfaStateName, currChar);
        dfaAutomaton.addTransition(currentState.stateName, dfaStateName, currChar);
      }

      statesToCheck.shift();
      if(statesToCheck.length > 0){
        currentState = statesToCheck[0];
      }
    }

    return dfaAutomaton;
  }

  transformEpsilonToDfa(){
    let dfaAutomaton = new Automata([], [], [], [], []);
    this.resetDataStates();
    dfaAutomaton.currentStateId = this.currentStateId;
    dfaAutomaton.currentTransitionId = this.currentTransitionId;
    this.alphabet.forEach(function(item){
      dfaAutomaton.addSymbolToAlphabet(item);
      alphabet.add({
        id: item,
        symbol: item
      });
    });

    //Start state section, setup
    let startStateClosure = this.startState.getClosure(new Set());
    let closureArray = Array.from(startStateClosure);
    let dfaStateName = this.joinStateNames(closureArray);

    let containsAcceptance = this.hasAcceptance(closureArray);
    let isInitial = true;
    this.addToStateDataSet(dfaAutomaton, dfaStateName, isInitial, containsAcceptance);
    dfaAutomaton.addState(dfaStateName, containsAcceptance, isInitial);
    let currentState = dfaAutomaton.states[0];
    currentState.setOfNfaStates = closureArray;
    let statesToCheck = [];
    statesToCheck.push(currentState);

    //checking the rest of the stations section
    while(statesToCheck.length > 0){
      currentState = statesToCheck[0];
      for(const currChar of this.alphabet){
        let currentStatesSet = new Set();

        //check NFA states from current State
        for(let i = 0; i < currentState.setOfNfaStates.length; ++i){
          let statesFromSymbol = currentState.setOfNfaStates[i].getNextStates(currChar);
          if(statesFromSymbol.length < 1){
            continue;
          }
          statesFromSymbol.sort(this.compareStatesByName);
          for(let stateInd = 0; stateInd < statesFromSymbol.length; ++stateInd){
            let item = statesFromSymbol[stateInd];
            currentStatesSet.add(item);
            let closureStatesFromSet = Array.from(item.getClosure(new Set()));
            closureStatesFromSet.sort(this.compareStatesByName);
            for(let closureState of closureStatesFromSet){
              console.log("adding: " + closureState.stateName);
              currentStatesSet.add(closureState);
            }
          }
        }
        let statesFromSet = Array.from(currentStatesSet);
        if(statesFromSet.length < 1){
          continue;
        }
        let dfaStateName = this.joinStateNames(statesFromSet);
        let indexOfNewState = dfaAutomaton.findStateByName(dfaStateName);
        let containsAnAcceptanceState = false;
        if(indexOfNewState < 0){
          let pastAcceptanceStates = this.acceptanceStates;
          containsAnAcceptanceState = this.hasAcceptance(statesFromSet);
          this.addToStateDataSet(dfaAutomaton, dfaStateName, !isInitial, containsAnAcceptanceState);
          dfaAutomaton.addState(dfaStateName, containsAnAcceptanceState, !isInitial);
          indexOfNewState = dfaAutomaton.states.length - 1;

          let newState = dfaAutomaton.states[indexOfNewState];
          newState.setOfNfaStates = statesFromSet;
          statesToCheck.push(newState);
        }
        this.addToTransitionDataSet(dfaAutomaton, currentState.stateName, dfaStateName, currChar);
        dfaAutomaton.addTransition(currentState.stateName, dfaStateName, currChar);
      }
      statesToCheck.shift();
    }

    return dfaAutomaton;
  }

  hasAcceptance(statesArray){
    for (let i = 0; i < statesArray.length; ++i) {
      let state = statesArray[i];
      if(this.acceptanceStates.includes(state.stateName)){
        return true;
      }
    }

    return false;
  }

  addToTransitionDataSet(automaton, originState, destinyState, symbol, transId, setIdManual){
    //Finding originStateId
    let indexOfOriginState = automaton.findStateByName(originState);
    let originStateId = automaton.states[indexOfOriginState].stateId;

    //Finding destinyStateId
    let destinyStateIndex = automaton.findStateByName(destinyState);
    let destinyStateId = automaton.states[destinyStateIndex].stateId;
    console.log("T ID: " + transId);
    let transitionID = setIdManual ? transId : automaton.currentTransitionId;
    console.log(setIdManual);
    console.log(transitionID);
    transitions.add({
          id: transitionID,
          from: originStateId,
          to: destinyStateId,
          label: symbol,
          font: {align: 'top'}
    });
  }

  joinStateNames(statesArray){
    let stateConcat = "";
    let stateLimit = statesArray.length - 1;
    for(let index = 0; index < stateLimit; ++index){
      stateConcat += statesArray[index].stateName + "-";
    }
    stateConcat += statesArray[stateLimit].stateName;

    return stateConcat;
  }

  compareStatesByName (firstState, secondState) {
    let firstStateName = firstState.stateId
    let secondStateName = secondState.stateId;

    if(firstStateName < secondStateName){
      return -1;
    }

    if(firstStateName > secondStateName){
      return 1;
    }

    return 0;
  }

  transformDfaToRegEx(){
    let dfaClones = this.getAutomatonCopies();
    let regexArr = new Array();

    for(let automaton of dfaClones){
      regexArr.push(getRegexFromDfa(automaton));
    }

    let regexString = joinRegExs(regexArr);

    return regexString;
  }

  getRegexFromDfa(automaton){
    //Setup
    let initial = automaton.startState;
    let finStateIndex = automaton.findStateByName(automaton.acceptanceStates[0]);
    let finalState = automaton.states[finStateIndex];
    let regexString = "";
    let statesCount = automaton.states.length;

    while(true){
      for(let state of automaton.states){
        if(!state.isInitial && !state.isAcceptance){
          let transitionsFromOthersToMyself = this.getTransitionsFromOthersToSelf(state, automaton);
          let transitionsToOtherStates = this.getTransitionsToOthers(state);
          let transitionsFromSelfToSelf = this.getTransitionsFromSelfToSelf(state);

          let stringToSelf = this.getStringOfLoopToSelf(transitionsFromSelfToSelf);

        }
      }
    }

    return regexString;
  }

  getTransitionsFromOthersToSelf(state, automaton){
    let stateName = state.stateName;
    let transitions = [];
    for(let state of automaton.states){
      if(state.stateName === stateName){
        continue;
      }

      for(let transition of state.transitions){
        if(transition.destinyState.stateName === stateName){
          transitions.push(transition);
        }
      }
    }

    return transitions;
  }

  getTransitionsToOthers(state){
    let transitions = [];

    for(let trans of state.transitions){
      if(trans.destinyState.stateName !== state.stateName){
        transitions.push(trans);
      }
    }

    return transitions;
  }

  getTransitionsFromSelfToSelf(state){
    let transitions = [];

    for(let trans of state.transitions){
      if(trans.destinyState.stateName === state.stateName){
        transitions.push(trans);
      }
    }

    return transitions;
  }

  transformRegexToNfaEpsilon(regex){
    let nfaEpsilonTree = peg$parse(regex);
    let automaton = this.transformRegFromTree(nfaEpsilonTree);

    this.resetDataStates();
    this.transformAutomatonToVisual(automaton);

    return automaton;
  }

  transformAutomatonToVisual(automaton){
    console.log(automaton);
    for(let state of automaton.states){
      console.log(state);
      for(let trans of state.transitions){
        console.log(trans.transitionID + " Origin: " + trans.originState.stateName + " Destiny: " + trans.destinyState.stateName);
      }
    }
    for(let state of automaton.states){
      console.log("Adding state to vis: " + state.stateName);
      this.addToStateDataSet(automaton, state.stateName, state.isInitial, state.isAcceptance, state.stateId, true);
      for(let transition of state.transitions){
        console.log("Adding trans: " + transition.symbol);
        this.addToTransitionDataSet(automaton, transition.originState.stateName,
          transition.destinyState.stateName, transition.symbol, transition.transitionID, true);
      }
    }
  }

  transformRegFromTree(regexTree){
    switch(regexTree.name){
      case 'kleene':
        return this.kleeneAutomaton(regexTree);
      case 'concat':
        return this.concatAutomaton(regexTree);
      case 'pipe':
        return this.pipeAutomaton(regexTree);
      case 'character':
        return this.characterAutomaton(regexTree);
    }
  }

  characterAutomaton(regexTree){
    let automaton = new Automata([], [], [], 'undefined', []);
    automaton.currentStateId = this.currentStateId;
    automaton.currentTransitionId = this.currentTransitionId;

    let newStateName = 'q' + this.currentStateId++;
    let isAcceptance = false;
    let isInitial = true;

    automaton.addState(newStateName, isAcceptance, isInitial);

    let newFinalState = 'q' + this.currentStateId++;
    automaton.addState(newFinalState, !isAcceptance, !isInitial);
    automaton.addTransition(newStateName, newFinalState, regexTree.value);
    ++this.currentTransitionId;
    return automaton;
  }

  concatAutomaton(regexTree){
    let firstAutomaton = this.transformRegFromTree(regexTree.left);
    let secondAutomaton = this.transformRegFromTree(regexTree.right);

    let firstFinal = firstAutomaton.getFinalState();
    let secondStart = secondAutomaton.startState;

    firstAutomaton.states.forEach(x => x.isAcceptance = false);
    secondAutomaton.states.forEach( x => x.isInitial = false);

    let newStates = firstAutomaton.states.concat(secondAutomaton.states);
    let concatAutomaton = new Automata(newStates, [], [], firstAutomaton.startState, secondAutomaton.acceptanceStates);
    concatAutomaton.currentStateId = this.currentStateId;
    concatAutomaton.currentTransitionId = this.currentTransitionId;

    concatAutomaton.addTransition(firstFinal.stateName, secondStart.stateName, regexTree.value);
    ++this.currentTransitionId;

    return concatAutomaton;
  }

  pipeAutomaton(regexTree){
    let firstAutomaton = this.transformRegFromTree(regexTree.left);
    let secondAutomaton = this.transformRegFromTree(regexTree.right);

    let firstFinal = firstAutomaton.states.find(x => x.isAcceptance === true);
    let firstInitial = firstAutomaton.states.find(x => x.isInitial === true);
    let secondInitial = secondAutomaton.states.find(x => x.isInitial === true);
    let secondFinal = secondAutomaton.states.find(x => x.isAcceptance === true);

    let newStates = firstAutomaton.states.concat(secondAutomaton.states);
    let pipeAutomaton = new Automata(newStates, [], [], firstAutomaton, [], []);
    pipeAutomaton.states.forEach( x => {x.isInitial = false; x.isAcceptance = false});
    pipeAutomaton.currentStateId = this.currentStateId;
    pipeAutomaton.currentTransitionId = this.currentTransitionId;

    let newInitialName = 'q' + this.currentStateId++;
    let newFinalName = 'q' + this.currentStateId++;
    let isInitial = true;
    let isAcceptance = true;
    pipeAutomaton.addState(newInitialName, !isAcceptance, isInitial);
    pipeAutomaton.addState(newFinalName, isAcceptance, !isInitial);

    pipeAutomaton.addTransition(newInitialName, firstInitial.stateName, this.epsilon);
    ++this.currentTransitionId;
    pipeAutomaton.addTransition(newInitialName, secondInitial.stateName, this.epsilon);
    ++this.currentTransitionId;
    pipeAutomaton.addTransition(firstFinal.stateName, newFinalName, this.epsilon);
    ++this.currentTransitionId;
    pipeAutomaton.addTransition(secondFinal.stateName, newFinalName, this.epsilon);
    ++this.currentTransitionId;

    return pipeAutomaton;
  }

  kleeneAutomaton(regexTree){
    let kleeneAutomaton = this.transformRegFromTree(regexTree.expression);

    let kleeneFinal = kleeneAutomaton.states.find(x => x.isAcceptance === true);
    let kleeneInitial = kleeneAutomaton.states.find(x => x.isInitial === true);

    kleeneAutomaton.states.forEach( x => { x.isInitial = false; x.isAcceptance = false});

    let newInitialName = 'q' + this.currentStateId++;
    let newFinalName = 'q' + this.currentStateId++;
    let isInitial = true;
    let isAcceptance = true;
    kleeneAutomaton.addState(newInitialName, !isAcceptance, isInitial);
    kleeneAutomaton.addState(newFinalName, isAcceptance, !isInitial);

    kleeneAutomaton.addTransition(newInitialName, newFinalName, this.epsilon);
    ++this.currentTransitionId;
    kleeneAutomaton.addTransition(newInitialName, kleeneInitial.stateName, this.epsilon);
    ++this.currentTransitionId;
    kleeneAutomaton.addTransition(kleeneFinal.stateName, newFinalName, this.epsilon);
    ++this.currentTransitionId;
    kleeneAutomaton.addTransition(kleeneFinal.stateName, kleeneInitial.stateName, this.epsilon);
    ++this.currentTransitionId;

    return kleeneAutomaton;
  }

  getFinalState(){
    let acceptanceName = this.acceptanceStates[0];
    return this.getStateByName(acceptanceName);
  }

  getAutomatonCopies(){
    let dfaClones = new Array();
    let newAcceptance = new Array();
    for(let i = 0; i < this.acceptanceStates.length; ++i){
      let newAutomaton = new Automata([], [], [], 'undefined', []);
      let hasAcceptance = false;
      for(let state of this.states){
        let isAcceptance = !hasAcceptance ? state.isAcceptance : false;
        newAutomaton.addState(state.stateName, isAcceptance, state.isInitial);
        if(state.isAcceptance && !hasAcceptance){
          newAcceptance.push(state.stateName);
          state.isAcceptance = false;
          hasAcceptance = true;
        }
        for(let transition of state.transitions){
          newAutomaton.addTransition(transition.originState, transition.destinyState, transition.symbol);
        }
      }
      dfaClones.push(newAutomaton);
    }

    for(let i = 0; i < newAcceptance.length; ++i){
      let stateIndex = this.findStateByName(newAcceptance[i]);
      this.states[stateIndex].isAcceptance = true;
    }

    return dfaClones;
  }
}
