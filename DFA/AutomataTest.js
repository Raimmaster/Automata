// let DFA = require("./DFA");

let alphabet = ['0', '1'];
console.log(alphabet);
// let states = ['q0', 'q1', 'q2'];
// console.log(states);
let acceptanceState = ['q2'];

let automata = new DFA([], alphabet, [], 'q0', acceptanceState);
automata.addState('q0');
automata.addState('q1');
automata.addState('q2');
console.log(automata.states);
automata.addTransition('q0', 'q1', '0');
automata.addTransition('q0', 'q2', '1');
automata.addTransition('q1', 'q2', '0');
automata.addTransition('q1', 'q2', '1');
automata.addTransition('q2', 'q2', '1');
automata.addTransition('q2', 'q0', '0');

console.log(automata.transitions);
