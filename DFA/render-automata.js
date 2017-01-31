function draw() {
    states = new vis.DataSet();
    states.on('*', function() {
      console.log(states.get());
      document.getElementById('states').innerHTML = JSON.stringify(states.get(), null, 4);
    });
    transitions = new vis.DataSet();
    transitions.on('*', function(){
      document.getElementById('transitions').innerHTML = JSON.stringify(transitions.get(), null, 4);
    });
    alphabet = new vis.DataSet();
    alphabet.on('*', function() {
      document.getElementById('alphabet').innerHTML = JSON.stringify(alphabet.get(), null, 4);
    });


    // create a network
    var container = document.getElementById('network');
    var data = {
        nodes: states,
        edges: transitions,
        alphabet: alphabet
    };

    var options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      edges: {
        arrows: {
          to: {enabled : true}
        }
      }
    };
    network = new vis.Network(container, data, options);
}
