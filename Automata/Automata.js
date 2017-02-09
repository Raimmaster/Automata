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
    let newState = new State(this.currentStateId++, state, []);
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
    let originState = this.states[indexOfOriginState];
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

  }

  evaluate(evaluationString){
    return this.evalAutomata(evaluationString, this.startState);
  }

  addToStateDataSet(automaton, stateName, isInitialState, isAcceptanceState){
    let borderColor = '';
    let stateColor = '';

    if(isInitialState){
      stateColor = '#58FA82';
      borderColor = '#FE2E2E';
    }

    if(isAcceptanceState){
      stateColor = '#FFBF00';
    }

    let currentStateId = automaton.currentStateId;
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

  transformNfaToDfa(){
    //Reset Data Sets
    states.clear();
    transitions.clear();
    alphabet.clear();

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

          console.log("S-for ID: ");
          console.log(dfaAutomaton.currentStateId);
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

  addToTransitionDataSet(automaton, originState, destinyState, symbol){
    //Finding originStateId
    let indexOfOriginState = automaton.findStateByName(originState);
    let originStateId = automaton.states[indexOfOriginState].stateId;

    //Finding destinyStateId
    let destinyStateIndex = automaton.findStateByName(destinyState);
    let destinyStateId = automaton.states[destinyStateIndex].stateId;

    let transitionID = automaton.currentTransitionId;
    console.log("Trans: ");
    console.log(transitionID);
    transitions.add({
          id: transitionID,
          from: originStateId,
          to: destinyStateId,
          label: symbol,
          font: {align: 'top'}
    });
    console.log("Same id: " + transitionID);
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
}
