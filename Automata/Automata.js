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
  }

  addSymbolToAlphabet(symbol){
    this.alphabet.push(symbol);
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
    const ORIGIN_OF_SPLICE = 0;
    const AMOUNT_TO_SPLICE = 1;

    for(const currChar of evalString){
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
          console.log("Evaluating: ");
          console.log(aState);
          if(this.acceptanceStates.includes(aState.stateName))
            return true;
        }
      }else{
      evalString.splice(ORIGIN_OF_SPLICE, AMOUNT_TO_SPLICE);
        let newEvalString = evalString;
        for (let sIndex = 0; sIndex < states.length; ++sIndex) {
          let currState = states[sIndex];

          arrayOfPasses.push(this.evalAutomata(newEvalString, currState));
        }

        console.log("Initial state " + initialState.stateName + " with " +  newEvalString);
      }
    }
    console.log("Arr of passes: ");
    console.log(arrayOfPasses);

    return arrayOfPasses.includes(true);
  }

  evaluate(evaluationString){
    return this.evalAutomata(evaluationString, this.startState);
  }

  transformNfaToDfa(){
    let dfaAutomaton = new Automata([], [], [], [], []);
    //Copy alphabet
    this.alphabet.forEach(function(item, index, array){
      dfaAutomaton.addSymbol(item);
    });

    let currentState = this.startState;

    let dfaStates = [];
    let statesToCheck = [];
    dfaStates.push(this.startState);

    //Get states from start state
    for(const currChar of this.alphabet){
      let statesFromSymbol = currentState.nextStates(currChar);
      statesFromSymbol.sort(compareStatesByName);

      let dfaStateName = this.joinStateNames(statesFromSymbol);
      dfaAutomaton.addState(dfaStateName);

      let indexOfNewState = dfaAutomaton.findStateByName(dfaStateName);
      let newState = dfaAutomaton.states[indexOfNewState];
      newState.setOfNfaStates = statesFromSymbol;
      currentState = newState;

      statesToCheck.push(currentState);
      dfaStates.push(currentState);
    }

    //create dfa table from the past states
    while(statesToCheck.length > 0){
      let currentStatesTransSet = new Set();

      for(const currChar of this.alphabet){
        for(let nfaStateIndex = 0; nfaStateIndex < currentState.setOfNfaStates.length; ++nfaStateIndex){
          let statesFromSymbol = currentState.setOfNfaStates[nfaStateIndex].nextStates(currChar);
          statesFromSymbol.sort(compareStatesByName);
          statesFromSymbol.forEach(function(item, index, array){
            currentStatesTransSet.add(item)
          });
        }
        let statesFromSet = Array.from(currentStatesTransSet);
        let dfaStateName = this.joinStateNames(statesFromSymbol);
        let indexOfNewState = dfaAutomaton.findStateByName(dfaStateName);
        if(indexOfNewState < 0){
          dfaAutomaton.addState(dfaStateName);
          indexOfNewState = dfaAutomaton.states.length - 1;

          let newState = dfaAutomaton.states[indexOfNewState];
          newState.setOfNfaStates = statesFromSymbol;
          statesToCheck.push(newState);
          dfaStates.push(newState);
        }

        dfaAutomaton.addTransition(currentState.stateName, dfaStateName, currChar);
      }

      statesToCheck.shift();
      if(statesToCheck.length > 0){
        currentState = statesToCheck[0];
      }
    }

    console.log(dfaAutomaton);
  }

  joinStateNames(statesArray){
    let stateConcat = "";
    let stateLimit = statesArray.length - 1;
    for(let index = 0; i < stateLimit; ++i){
      stateConcat += statesArray[i].stateName + "-";
    }
    stateConcat += statesArray[stateLimit].stateName;

    return stateConcat;
  }

  compareStatesByName (firstState, secondState) {
    let firstStateName = firstState.stateName.toUpperCase();
    let secondStateName = secondState.stateName.toUpperCase();

    if(firstStateName < secondStateName){
      return -1;
    }

    if(firstStateName > secondStateName){
      return 1;
    }

    return 0;
  });
}
