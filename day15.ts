import { Input, solver } from "./solver.ts";

function inputParser(input: Input) {
  return input.lines().map(line => line.split('').map(Number));
}

interface Point {
  x: number;
  y: number;
}

await solver(inputParser, {
  expectedTestResults: {
    part1: 40,
    part2: 315,
  },

  part1: input => {
    return dynamicPath(input.parsed);
  },

  part2: input => {
    const expandedGrid = expandGrid(input.parsed, 5);
    return dynamicPath(expandedGrid);
  },
});

function dynamicPath(grid: number[][]): number {
  const bestPathToNode = new Map<string, number>();
  const gridSize = grid.length;
  const startPoint: Point = {x: 0, y: 0};
  const endPoint: Point = {x: gridSize - 1, y: gridSize - 1};
  bestPathToNode.set(nodeKey(startPoint), 0);
  for (let offset = 1; offset < gridSize; offset++) {
    for (let n = 0; n <= offset; n++) {
      findBestIncrementalPath(bestPathToNode, {x: n, y: offset}, grid);
      findBestIncrementalPath(bestPathToNode, {x: offset, y: n}, grid);
    }
  }
  let lastResult = dumpPathMap(bestPathToNode);
  let newResult = '';
  while(lastResult !== newResult) {
    for (let x = 1; x < gridSize; x++) {
      for (let y = 1; y < gridSize; y++) {
        findBestIncrementalPath(bestPathToNode, {x, y}, grid);
      }
    }
    lastResult = newResult;
    newResult = dumpPathMap(bestPathToNode);
  }
  return bestPathToNode.get(nodeKey(endPoint))!;
}

function nodeKey(node: Point): string {
  return JSON.stringify(node);
}

function findBestIncrementalPath(bestPathToNode: Map<string,number>, point: Point, grid: number[][]) {
  const predecessors = [
    {x: point.x, y: point.y - 1},
    {x: point.x, y: point.y + 1},
    {x: point.x - 1, y: point.y},
    {x: point.x + 1, y: point.y},
  ];
  const predRisks = predecessors.map(p => bestPathToNode.get(nodeKey(p))).filter(p => p != null) as number[];
  const totalRisk = Math.min(...predRisks) + grid[point.y][point.x];
  bestPathToNode.set(nodeKey(point), totalRisk);
}

function expandGrid(oldGrid: number[][], times: number) {
  const expandedGrid = new Array<Array<number>>();
  for (let tileY = 0; tileY < times; tileY++) {
    for (let tileX = 0; tileX < times; tileX++) {
      for (let oldY = 0; oldY < oldGrid.length; oldY++) {
        for (let oldX = 0; oldX < oldGrid.length; oldX++) {
          const newPoint = {x: oldX + (tileX * oldGrid.length), y: oldY + (tileY * oldGrid.length)};
          const oldRisk = oldGrid[oldY][oldX];
          let newRisk = oldRisk + tileX + tileY;
          while (newRisk > 9) {
            newRisk -= 9;
          }
          if (expandedGrid[newPoint.y] == null) {
            expandedGrid[newPoint.y] = [];
          }
          expandedGrid[newPoint.y][newPoint.x] = newRisk;
        }
      }
    }
  }
  return expandedGrid;
}

function dumpPathMap(paths: Map<string, number>) {
  const dump: Record<string, number> = {};
  paths.forEach((value, key) => dump[key] = value);
  return JSON.stringify(dump);
}