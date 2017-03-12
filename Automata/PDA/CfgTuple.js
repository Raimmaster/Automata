class CfgTuple{
  constructor(symbol, productions = []){
    this.nonterminalSymbol = symbol;
    this.productions = [];
    this.productions.push(productions);
    this.isInitial = false;
  }

  addProduction(productionString){
    this.productions.push(productionString);
  }

  tupleToString(){
    let string = this.nonterminalSymbol;
    for(let i = 0; i < this.productions.length; ++i){
      if(i === 0){
        string += "->" + this.productions[i] + "\n";
      }else {
        string += "|" + this.productions[i] + "\n";
      }
    }

    return string;
  }
}
