class Tape{
  constructor(string){
    this.originalString = string;
    this.emptyValue = 'β';
    this.tape = this.emptyValue + string + this.emptyValue;
    this.cursor = 1;
    this.noMoreCursorMovement = false;
  }

  moveTape(transition){
    let moveValue = transition.direction == 'right' ? 1 : -1;
    this.tape[this.cursor] = transition.newSymbol;
    this.cursor += moveValue;

    if(transition.destinyState.isAcceptance){
      this.noMoreCursorMovement = true;
    }
  }

  getCurrChar(){
    return this.tape[this.cursor];
  }
}
