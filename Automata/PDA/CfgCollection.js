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
    console.log("After:");
    console.log(cfgValues);
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
}
