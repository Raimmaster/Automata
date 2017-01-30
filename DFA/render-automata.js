function draw() {
    states = new vis.DataSet();
    transitions = new vis.DataSet();
    alphabet = new vis.DataSet();
    alphabet.on('*', function() {
      document.getElementById('alphabet').innerHTML = JSON.stringify(alphabet.get(), null, 4);
    })

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
