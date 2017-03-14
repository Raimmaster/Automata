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
  }

  addState(state, isAcceptance, isInitial){
    if(this.getStateByName(state) !== 'undefined'){
      return 'undefined';
    }

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

      if(evalString.length === 0){
        return this.acceptanceStates.includes(initialState.stateName);
      }

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
    console.log("The epsilon eval: " + evalString);
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
        console.log("Now in a:State:" + aState.stateName);
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
    console.log(arrayOfPasses);
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
    
    console.log("State: " + currentStateId);
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
    let dfaAutomaton = new Automata([], this.alphabet, [], [], []);
    dfaAutomaton.currentStateId = ++this.currentStateId;
    dfaAutomaton.currentTransitionId = ++this.currentTransitionId;
    //Copy alphabet
    
    let currentState = this.startState;

    let statesToCheck = [];
    let isAcceptanceState = this.acceptanceStates.includes(this.startState.stateName);

    addToStateDataSet(dfaAutomaton, this.startState.stateName, true, isAcceptanceState, '', false);
    dfaAutomaton.addState(currentState.stateName, isAcceptanceState, true);

    //Get states from start state
    for(const currChar of this.alphabet){
      console.log("INSIDE!");
      let statesFromSymbol = currentState.getNextStates(currChar);
      if(statesFromSymbol.length < 1) {
        continue;
      }
      statesFromSymbol.sort(this.compareStatesByName);

      let containsAnAcceptanceState = false;
      let pastAcceptanceStates = this.acceptanceStates;
      for(let item of statesFromSymbol){
        containsAnAcceptanceState = pastAcceptanceStates.includes(item.stateName);
        if(containsAnAcceptanceState){
          break;
        }
      }

      let dfaStateName = this.joinStateNames(statesFromSymbol);
      let newState = dfaAutomaton.getStateByName(dfaStateName);
      if(newState === 'undefined'){
        addToStateDataSet(dfaAutomaton, dfaStateName, false, 
          containsAnAcceptanceState, '', false);
        console.log("Adding state: " + dfaStateName + " with ID: " + dfaAutomaton.currentStateId);
        newState = dfaAutomaton.addState(dfaStateName, false, containsAnAcceptanceState);
        newState.setOfNfaStates = statesFromSymbol;
        statesToCheck.push(newState);
      }

      this.addToTransitionDataSet(dfaAutomaton, currentState.stateName, dfaStateName, currChar);
      dfaAutomaton.addTransition(currentState.stateName, dfaStateName, currChar);
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
          for(let stado of statesFromSet){
            containsAnAcceptanceState = pastAcceptanceStates.includes(stado.stateName);
            if(containsAnAcceptanceState){
              break;
            }
          }
          

          this.addToStateDataSet(dfaAutomaton, dfaStateName, false, containsAnAcceptanceState, '', false);
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
      if(dfaAutomaton.alphabet.includes(item))
        return;
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
    let indexOfOriginState = automaton.findStateByName(originState);
    let originStateId = automaton.states[indexOfOriginState].stateId;
    let destinyStateIndex = automaton.findStateByName(destinyState);
    let destinyStateId = automaton.states[destinyStateIndex].stateId;
    let transitionID = setIdManual ? transId : automaton.currentTransitionId;
    console.log("Origin ID: " + originStateId + " and destiny ID: " + destinyStateId);
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
      regexArr.push(this.getRegexFromDfa(automaton));
    }

    let regexString = this.joinRegExs(regexArr);

    return regexArr;
  }

  joinRegExs(regexArr){
    for(let i = 0; i < regexArr.length; ++i){
      regexArr[i] = "(" + regexArr[i] + ")"; 
    }

    return regexArr.join("+");
  }

  getRegexFromDfa(automaton){
    //Setup
    let initial = automaton.startState;
    let finalState = automaton.states.find( state => state.isAcceptance);
    let regexString = "";
    let statesCount = automaton.states.length;

    while(true){
      for(let state of automaton.states){
        if(!state.isInitial && !state.isAcceptance){
          let transitionsFromOthersToMyself = automaton.getTransitionsFromOthersToSelf(state);
          let transitionsToOtherStates = automaton.getTransitionsToOthers(state);
          let transitionsFromSelfToSelf = automaton.getTransitionsFromSelfToSelf(state);

          let stringToSelf = automaton.getStringOfLoopToSelf(transitionsFromSelfToSelf);

        }
      }
    }

    return regexString;
  }

  getStringOfLoopToSelf(transitions){
    let stringArr = [];

    for(let trans of transitions){
      let string = "(" + trans.symbol + ")*";
      stringArr.push(string);
    }

    return stringArr.join("+");
  }

  getTransitionsFromOthersToSelf(state){
    let stateName = state.stateName;
    let transitions = [];
    for(let state of this.states){
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
    automaton.setType('nfa-epsilon');
    return automaton;
  }

  transformAutomatonToVisual(automaton){
    console.log(automaton);
    for(let state of automaton.states){
      this.addToStateDataSet(automaton, state.stateName, state.isInitial, state.isAcceptance, state.stateId, true);
      for(let transition of state.transitions){
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
    automaton.addSymbolToAlphabet(regexTree.value);
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
    let newAlphabet = firstAutomaton.alphabet.concat(secondAutomaton.alphabet);
    console.log("Acc s: " + secondAutomaton.acceptanceStates[0]);
    let concatAutomaton = new Automata(newStates, newAlphabet, [], firstAutomaton.startState, secondAutomaton.acceptanceStates);
    concatAutomaton.currentStateId = this.currentStateId;
    concatAutomaton.currentTransitionId = this.currentTransitionId;

    concatAutomaton.addTransition(firstFinal.stateName, secondStart.stateName, this.epsilon);
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
    let newAlphabet = firstAutomaton.alphabet.concat(secondAutomaton.alphabet);
    let pipeAutomaton = new Automata(newStates, newAlphabet, [], firstAutomaton, [], []);
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

  unionIntersect(automataList, checkAcceptanceInArrayFunc){
    if(automataList.length < 2)
      return;

    let initials = [];

    for(let automaton of automataList){
      initials.push(automaton.states.find(state => state.isInitial));
    }
    let newAlphabet = automataList[0].alphabet.concat(automataList.alphabet);
    let newSetAlpha = new Set(newAlphabet);
    let unionAutomaton = new Automata([], Array.from(newSetAlpha), [], 'undefined', []);
    console.log(unionAutomaton.alphabet);
    let isInitial = true;

    let initialA = initials[0];
    let initialB = initials[1];

    let initialStateName = this.joinUnionStateName(initials);
    let containsAcceptance = checkAcceptanceInArrayFunc(initials);
    
    unionAutomaton.addToStateDataSet(unionAutomaton, initialStateName, 
      isInitial, containsAcceptance, '', false);
    
    let initialState = unionAutomaton.addState(initialStateName, containsAcceptance, isInitial);
    initialState.setOfNfaStates = initials;
    let statesToCheck = [];
    for(const currChar of this.alphabet){
      let statesFromSymbol = [];
      for(let currState of initialState.setOfNfaStates){
        //console.log("Checking this state: " + currState.stateName);
        let nextState = currState.getNextState(currChar);
         
        if(nextState != 'undefined'){
          //console.log("State name added to arr: " + nextState.stateName);
          statesFromSymbol.push(nextState);
        }
      }
      if(statesFromSymbol.length < 1){
        //console.log("No states found.");
        continue;
      }
      //console.log("States from symbol: ");
      //console.log(statesFromSymbol);
      let newStateName = this.joinUnionStateName(statesFromSymbol);

      //console.log("New state from initial: " + newStateName);
      let isManualIDSetting = false; 

      containsAcceptance = checkAcceptanceInArrayFunc(statesFromSymbol);
      unionAutomaton.addToStateDataSet(unionAutomaton, newStateName, 
        !isInitial, containsAcceptance, '', isManualIDSetting);
      
      let newState = unionAutomaton.addState(newStateName, containsAcceptance, !isInitial);
      
      console.log("New state added from initial: " + newState.stateName);
      newState.setOfNfaStates = statesFromSymbol;
      statesToCheck.push(newState);
      
      unionAutomaton.addToTransitionDataSet(unionAutomaton, initialState.stateName, 
        newStateName, currChar, '', isManualIDSetting);
      unionAutomaton.addTransition(initialState.stateName, newStateName, currChar);
    }

    let currState = statesToCheck[0];
    //console.log("Before entering the while loop with current state:" + currState.stateName);
    //console.log(statesToCheck);
    while(statesToCheck.length > 0){
      for(const currChar of unionAutomaton.alphabet){
        let statesFromSymbol = [];
        for(let stateOfCurrState of currState.setOfNfaStates){
          //console.log(stateOfCurrState);
          let stateFound = stateOfCurrState.getNextState(currChar); 

          if(stateFound === 'undefined'){
            //console.log("No states found in this loop.");
            continue;
          }
          statesFromSymbol.push(stateFound);
        }

        if(statesFromSymbol.length < 1){
          continue;
        }

        let newStateName = this.joinUnionStateName(statesFromSymbol);
        console.log("New state name:" + newStateName);
        let stateExists = unionAutomaton.getStateByName(newStateName);

        if(stateExists === 'undefined'){
          containsAcceptance = checkAcceptanceInArrayFunc(statesFromSymbol);
          this.addToStateDataSet(unionAutomaton, newStateName, !isInitial, containsAcceptance, '', false);
          let newState = unionAutomaton.addState(newStateName, containsAcceptance, !isInitial);
          newState.setOfNfaStates = statesFromSymbol;
          statesToCheck.push(newState);
        }

        this.addToTransitionDataSet(unionAutomaton, currState.stateName, newStateName, currChar, '', false);
        unionAutomaton.addTransition(currState.stateName, newStateName, currChar, '', false);
      }
      statesToCheck.shift();
      if(statesToCheck.length > 0){
        currState = statesToCheck[0];
        console.log("New current state: " + currState.stateName);
      }
    }

    return unionAutomaton;
  }

  joinUnionStateName(statesArray){
    let stateConcat = "";
    for(let index = 0; index < statesArray.length; ++index){
      stateConcat += statesArray[index].stateName;
    }
    return stateConcat;
  }

  minimize(){
    let equivalenceTable = this.createEquivalenceTable();
    equivalenceTable = this.markNotAcceptance(equivalenceTable);
    console.log(equivalenceTable);
    let minimizedAutomaton = this.minimizeFromTable(equivalenceTable);
    this.transformAutomatonToVisual(minimizedAutomaton);
    console.log("Finished minimizing.");
    return minimizedAutomaton;
  }

  minimizeFromTable(table){
    let minimizedStateArray = [];
    let minimizedAutomaton = new Automata([], this.alphabet, [], 'undefined', []);
    //Add states; new ones and not new ones
    for(let tuple of table){
      if(tuple.equivalent){
        let tupleStates = tuple.getStateArray();
        
        tupleStates = minimizedAutomaton.oneOfTupleStatesHasBeenAdded(tupleStates);

        let newStateName = this.joinStateNames(tupleStates);
        let newMinimizedState = minimizedAutomaton.addState(newStateName, tuple.containsAcceptance(), tuple.containsInitial());
        newMinimizedState.setOfNfaStates = tupleStates;        
      }
    }
    
    for(let tuple of table){
      if(!tuple.equivalent){
        let tupleStates = tuple.getStateArray();
        for(let state of tupleStates){
          if(!minimizedAutomaton.stateHasBeenMinimized(state)){
            let newState = minimizedAutomaton.addState(state.stateName, state.isAcceptance, state.isInitial);
            newState.setOfNfaStates = [state];
          }
        }
      }
    }

    //Add transitions 
    //for(const currChar of minimizedAutomaton.alphabet){
      for(let state of minimizedAutomaton.states){
        for(let arrState of state.setOfNfaStates){
          for(let transition of arrState.transitions){
            let destinyState = minimizedAutomaton.findStateIfContained(transition.destinyState);
            minimizedAutomaton.addTransition(state.stateName, destinyState.stateName, transition.symbol);
          }
        }
      }
    //}

    return minimizedAutomaton;
  }

  findStateIfContained(state){
    for(let currState of this.states){
      if(currState.setOfNfaStates.includes(state)){
        return currState;
      }

      if(currState === state){
        return currState;
      }
    }

    return 'undefined';
  }

  stateHasBeenMinimized(state){
    for(let currState of this.states){
      if(currState.setOfNfaStates.includes(state)){
        console.log("Contains it.");
        return true;
      }
    }

    return false;
  }

  oneOfTupleStatesHasBeenAdded(tupleStates){
    for(let tupState of tupleStates){
      for(let i = 0; i < this.states.length; ++i){
        let autState = this.states[i];
        let tupStateInAutomatonStates = autState.setOfNfaStates.includes(tupState);
        
        if(tupStateInAutomatonStates){
          
          if(autState.isAcceptance && !tupState.isAcceptance){
            return tupleStates;
          }

          let newTupleArray = this.constructTupleArray(autState.setOfNfaStates, tupleStates);
          this.states.splice(i, 1);


          return newTupleArray;
        }
      }
    }

    return tupleStates;
  }

  constructTupleArray(setOfStates, tupleStates){
    let statesSet = new Set();
    for(let state of tupleStates){
      statesSet.add(state);
    }

    for(let state of setOfStates){
      statesSet.add(state);
    }

    return Array.from(statesSet);
  }

  markNotAcceptance(table){
    let thereAreUnverifiedStates = table.filter(tupl => !tupl.equivalenceVerified);
    while(thereAreUnverifiedStates.length > 0){
      let checkedStates = [];
      for(let rowTuple of table){
        if(checkedStates.includes(rowTuple.firstState.stateName)){
          continue;
        }      
        let allRowStateElements = table.filter(x => 
          x.firstState.stateName === rowTuple.firstState.stateName);
        
        for(let currentTuple of allRowStateElements){
          if(!currentTuple.equivalenceVerified){
            this.checkEquivalence(currentTuple, table);
            console.log("Tuple of checked: " + currentTuple.firstState.stateName);
          }
        }

        checkedStates.push(rowTuple.firstState.stateName);
      }

      thereAreUnverifiedStates = table.filter(tupl => !tupl.equivalenceVerified);
    }

    return table;
  }

  checkEquivalence(tuple, table){
    let firstState = tuple.firstState;
    let secondState = tuple.secondState;
    let discovered = tuple.discovered;
    let isVerified = tuple.equivalenceVerified;

    const hasBeenDiscovered = true;
    const isEquivalent = true;
    const hasBeenVerified = true;

    if(!isVerified){
      if(!discovered){
        if(firstState.isAcceptance){
          if(!secondState.isAcceptance){
            tuple.setCheckedStatus(hasBeenDiscovered, !isEquivalent, hasBeenVerified);
          }else {
            this.checkTransitionEquivalence(tuple, table);
          }
        }else if(secondState.isAcceptance){
          tuple.setCheckedStatus(hasBeenDiscovered, !isEquivalent, hasBeenVerified);
        }else {
          this.checkTransitionEquivalence(tuple, table);
        }
      }else {
        if(firstState.isAcceptance){
          tuple.setCheckedStatus(hasBeenDiscovered, secondState.isAcceptance, hasBeenVerified);
        }else if(secondState.isAcceptance){
          tuple.setCheckedStatus(hasBeenDiscovered, !isEquivalent, hasBeenVerified);
        }
        else {
          //TO-DO
          //Check if the tuple's states have the SAME transitions
          //And if not, check if their transitions are equivalent
          this.checkTransitionEquivalence(tuple, table);
        }
      }
    }
  }

  checkTransitionEquivalence(tuple, table){    
    const hasBeenDiscovered = true;
    const equivalenceConfirmed = true;
    const hasBeenVerified = true;

    if(!tuple.discovered){
      let arrayOfTuples = this.getArrayOfTuples(tuple, table);
      
      console.log(arrayOfTuples);
      for(let tupleElement of arrayOfTuples){
        let isEquivalent = this.checkTuplesStateEquivalence(tuple, table);
        if(!isEquivalent){
          //Set that they're not equivalent?
          tuple.setCheckedStatus(hasBeenDiscovered, !isEquivalent, hasBeenVerified);
          return;
        }
      }

      tuple.setCheckedStatus(hasBeenDiscovered, equivalenceConfirmed, hasBeenVerified);
    }else{
      let willBeEquivalent = this.checkTuplesStateEquivalence(tuple, table);
      tuple.setCheckedStatus(hasBeenDiscovered, willBeEquivalent, hasBeenVerified);
    }
  }

  checkTuplesStateEquivalence(tuple, table){
    let firstState = tuple.firstState;
    let secondState = tuple.secondState;
    let discovered = tuple.discovered;

    if(firstState === secondState){
      return true;
    }

    let comparisonTuple = this.getTupleFromNextStates(firstState, secondState, table);

    if(comparisonTuple.discovered){
      if(comparisonTuple.equivalenceVerified){
        return comparisonTuple.equivalent;
      }else{
        //verify the equivalence of the tuple
        //this.checkTransitionEquivalence(comparisonTuple, table);        
        //return comparisonTuple.equivalent;
      }
    }else {
      //this.checkTransitionEquivalence(comparisonTuple, table);
      //return comparisonTuple.equivalent;
    }
  }

  getArrayOfTuples(tuple, table){
    let firstState = tuple.firstState;
    let secondState = tuple.secondState;
    
    const hasBeenDiscovered = true;
    const isEquivalent = true;
    const hasBeenVerified = true;

    let arrayOfTuples = [];

    for(const currChar of this.alphabet){
      let firstNextState = firstState.getNextState(currChar);
      let secondNextState = secondState.getNextState(currChar);

      if(firstNextState === 'undefined'){
        if(secondNextState !== 'undefined'){
          tuple.setCheckedStatus(hasBeenDiscovered, !isEquivalent, hasBeenVerified);
          return arrayOfTuples;
        }
      }else if(secondNextState === 'undefined'){
        tuple.setCheckedStatus(hasBeenDiscovered, !isEquivalent, hasBeenVerified);
        return arrayOfTuples;
      }else {
        if(firstNextState === secondNextState){
          //In case that they go to the same place, add that tuple to Array of tuples
          //and skip one iteration of loop
          let sameStateTuple = new EqTuple(firstNextState, secondNextState, true, true);
          sameStateTuple.equivalenceVerified = true;
          arrayOfTuples.push(sameStateTuple);
          continue;
        }
      }

      let transitionTuple = this.getTupleFromNextStates(firstNextState, secondNextState, table);

      arrayOfTuples.push(transitionTuple);
    }
    
    tuple.discovered = true;

    return arrayOfTuples;
  }

  getTupleFromNextStates(firstNextState, secondNextState, table){
    let tuple = table.find(x => x.firstState === firstNextState
          && x.secondState === secondNextState);

    if(tuple === 'undefined'){
      tuple = table.find(x => x.firstState === secondNextState
          && x.secondState === firstState);
    }
    return tuple;
  }

  createEquivalenceTable(){
    let table = [];
    for (let i = 0; i < this.states.length; ++i) {
      let firstState = this.states[i];
      //console.log("First state: " + firstState.stateName);
      for(let k = i + 1; k < this.states.length; ++k){
        let secondState = this.states[k];
        console.log("State pair: " + firstState.stateName + ", " + secondState.stateName);
        console.log("Current k: "+ k + " and i: " + i);
        let newTuple = new EqTuple(firstState, secondState, false, false);
        table.push(newTuple);  
      }
    }

    return table;
  }
}
