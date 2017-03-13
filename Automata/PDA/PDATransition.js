class PDATransition{
  constructor(transitionID, originState, destinyState,
    transitionSymbol, symbolOnTopOfStack, production,
    willPushSymbol, willPushBackTop){
      this.transitionID = transitionID;
      this.originState = originState;
      this.destinyState = destinyState;
      this.transitionSymbol = transitionSymbol;
      this.symbolOnTopOfStack = symbolOnTopOfStack;
      this.willPushSymbol = willPushSymbol;
      this.willPushBackTop = willPushBackTop;
      this.production = production;
    }

    getStackString(){
      let transSymbol = this.transitionSymbol;
      let stackString = '';
      if(transSymbol == '#'){
        transSymbol = ' ';
      }
      if(this.production !== undefined){
          stackString = this.production;
      }else {
        stackString =  transSymbol + this.symbolOnTopOfStack;
      }

      if(!this.willPushSymbol && !this.willPushBackTop){
        stackString = 'ε';
      }

      return stackString;
    }

    getStringLength(){
      if(this.production != undefined){
        return this.production.length;
      }

      let pushValueCount = 0;
      if(trans.willPushSymbol){
        ++pushValueCount;
      }

      if(trans.willPushBackTop){
        ++pushValueCount;
      }

      return pushValueCount;
    }

    getTransitionString(){
      if(this.production != undefined){
        return this.production;
      }

      let 
    }
}
