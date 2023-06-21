function selectNode(nodes, bias) {
    if (bias) {
      // Calculate the cumulative weights
      let cumulativeWeights = [];
      let totalWeight = 0;
      for (let i = 0; i < bias.length; i++) {
        totalWeight += bias[i];
        cumulativeWeights.push(totalWeight);
      }
      
      // Generate a random value within the total weight
      const randomValue = Math.random() * totalWeight;
      
      // Find the index where the random value falls
      let index = 0;
      while (randomValue > cumulativeWeights[index]) {
        index++;
      }
      
      return nodes[index];
    } else {
      return nodes[Math.floor(Math.random() * nodes.length)];
    }
  }
    const nodes = ['Node A', 'Node B', 'Node C', 'Node D', 'Node E', 'Node F', 'Node G'];
  const bias = [0,1,1,1,3,3,10];  
  const selectedNode = selectNode(nodes, bias);
  console.log(selectedNode);