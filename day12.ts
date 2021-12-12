import { lineTokenParser, solve } from "./helpers.ts";

await solve({
  baseFileName: 'day12',

  parser: lineTokenParser({
    parseFn: tokens => ({cave1: tokens[0], cave2: tokens[1]}),
  }),

  expectedTestResults: {
    part1: 19,
    part2: 103,
  },

  part1: inputs => {
    const graph = buildGraph(inputs.parsed);
    const paths = countPaths(graph, 1);
    return paths;
  },

  part2: inputs => {
    const graph = buildGraph(inputs.parsed);
    const paths = countPaths(graph, 2);
    return paths;
  },
});

function countPaths(graph: Map<string, Set<string>>, smallLimit: number, cave = 'start', visited: string[] = ['start']): number {
  const connections = graph.get(cave)!;
  let paths = 0;
  for (const otherCave of connections.values()) {
    if (otherCave === 'end') {
      paths++;
    } else if (otherCave !== 'start') {
      const size = caveSize(otherCave);
      const visitedCount = visited.filter(x => x === otherCave).length + 1;
      if (size === 'large' || visitedCount <= smallLimit) {
        const newLimit = (size == 'small' && visitedCount === smallLimit) ? 1 : smallLimit;
        paths += countPaths(graph, newLimit, otherCave, [...visited, cave]);
      }
    }
  }
  return paths;
}

function buildGraph(parsedInput: {cave1: string, cave2: string}[]) {
  const graph = new Map<string, Set<string>>();
  for (const connection of parsedInput) {
    const cave1Connections = getCaveConnections(graph, connection.cave1);
    const cave2Connections = getCaveConnections(graph, connection.cave2);
    graph.get(connection.cave1) ?? [];
    cave1Connections.add(connection.cave2);
    cave2Connections.add(connection.cave1);
  }
  return graph;
}

function getCaveConnections(graph: Map<string, Set<string>>, cave: string): Set<string> {
  let caveConnections = graph.get(cave);
  if (caveConnections == null) {
    caveConnections = new Set();
    graph.set(cave, caveConnections);
    return caveConnections;
  }
  return caveConnections;
}

function caveSize(cave: string) {
  if (cave.toLowerCase() === cave) {
    return 'small';
  } else {
    return 'large';
  }
}