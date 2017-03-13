class CfgCollection{
  constructor(terminals = []){
    this.cfgCollection = [];
    this.terminals = terminals;
  }

  addCfgProduction(cfgString){
    let cfgValues = cfgString.split('->');
    let existingTuple = this.cfgCollection.find(x => x.nonterminalSymbol == cfgValues[0]);
    if(existingTuple !== undefined){
      console.log(cfgValues);
      existingTuple.addProduction(cfgValues[1]);
      return;
    }
    let newTuple = new CfgTuple(cfgValues[0], cfgValues[1]);
    if(this.cfgCollection.length === 0){
      newTuple.isInitial = true;
    }
    this.cfgCollection.push(newTuple);
  }

  addTerminals(terminalSymbols){
    let terminals = terminalSymbols.split(',');
    this.terminals = terminals;
    return terminals;
  }

  getCfgCollectionString(){
    let string = "";
    for(let cfg of this.cfgCollection){
      string += cfg.tupleToString() + "\n";
    }

    return string;
  }

  convertToPDA(automaton){
    automaton.alphabet = this.terminals;
    automaton.addState('q0', false, true);
    automaton.type = 'empty-pda';
    for(let cfg of this.cfgCollection){
      let nonterminalSymbol = cfg.nonterminalSymbol;
      for(let prod of cfg.productions){
        let transition = automaton.addTransition('q0', 'q0', 'epsilon',
          nonterminalSymbol, prod, true, false);
        transitionsCollection.push(transition);
      }
    }

    for(let terminal of this.terminals){
      let transition = automaton.addTransition('q0', 'q0',
          terminal, terminal, undefined, false, false);
      transitionsCollection.push(transition);
    }
    transformAutomatonToVisual(automaton);
    automaton.grammarCollection = this.cfgCollection;
    return automaton;
  }

}
