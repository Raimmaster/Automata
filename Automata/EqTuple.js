class EqTuple{
	constructor(firstState, secondState, discovered, equivalent){
		this.firstState = firstState;
		this.secondState = secondState;
		this.discovered = discovered;
		this.equivalent = equivalent;
		this.equivalenceVerified = false;
	}

	setCheckedStatus(discovered, equivalent, verified){
		this.discovered = discovered;
		this.equivalent = equivalent;
		this.equivalenceVerified = verified;
	}
}