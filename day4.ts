import { getInput } from "./helpers.ts";

const input = await getInput('day4');
const inputLines = input.split('\n');
const numbersCalled = inputLines.shift()!.split(',').map(num => Number(num));
inputLines.shift(); // consume empty line between numbers called and boards
const {boards, boardStates} = createBoards();

function createBoards() {
  const boards: Array<Array<Array<number>>> = [[]];
  const boardStates: Array<Array<Array<boolean>>> = [[]];
  let boardIndex = 0;
  for (const line of inputLines) {
    if (line.length === 0) {
      // empty line means end of card
      boards.push([]);
      boardStates.push([]);
      boardIndex++;
      continue;
    }
    const lineNumbers = line.trim().split(/\s+/).map(num => Number(num));
    boards[boardIndex].push(lineNumbers);
    boardStates[boardIndex].push(lineNumbers.map(_ => false));
  }
  return {boards, boardStates};
}

function fillBoard(boardIndex: number, rowIndex: number, colIndex: number) {
  const boardState = boardStates[boardIndex];
  boardState[rowIndex][colIndex] = true;
  if (boardState[rowIndex].filter(x => x === false).length === 0) {
    return true;
  }
  for (const row of boardState) {
    if (row[colIndex] === false) {
      return false;
    }
  }
  return true;
}

function getScore(boardIndex: number) {
  const board = boards[boardIndex];
  const boardState = boardStates[boardIndex];
  let score = 0;
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    const row = board[rowIndex];
    const rowState = boardState[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      if (rowState[colIndex] === false) {
        score += row[colIndex];
      }
    }
  }
  return score;
}

function part1() {
  for (const num of numbersCalled) {
    for (let boardIndex = 0; boardIndex < boards.length; boardIndex++) {
      const board = boards[boardIndex];
      for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        const row = board[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] === num) {
            const won = fillBoard(boardIndex, rowIndex, colIndex);
            if (won) {
              const score = getScore(boardIndex);
              return num * score;
            }
          }
        }
      }
    }
  }
}

function part2() {
  const boardsInPlay = boards.map(_ => true);
  for (const num of numbersCalled) {
    for (let boardIndex = 0; boardIndex < boards.length; boardIndex++) {
      const board = boards[boardIndex];
      for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        const row = board[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] === num) {
            const won = fillBoard(boardIndex, rowIndex, colIndex);
            if (won) {
              boardsInPlay[boardIndex] = false;
              if (boardsInPlay.filter(x => x === true).length === 0) {
                const score = getScore(boardIndex);
                return num * score;
              }
            }
          }
        }
      }
    }
  }
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
