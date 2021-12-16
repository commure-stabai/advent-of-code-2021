import { product, sum } from "./helpers.ts";
import { solver } from "./solver.ts";

enum PacketType {
  SUM = 0,
  PRODUCT = 1,
  MINIMUM = 2,
  MAXIMUM = 3,
  LITERAL = 4,
  GREATER_THAN = 5,
  LESS_THAN = 6,
  EQUAL_TO = 7,
}
type OperatorType = Exclude<PacketType, PacketType.LITERAL>;

interface ParserState {
  message: string[];
  bits: string;
}

interface PacketHeader {
  version: number;
  type: PacketType;
  headerBits: number;
}

type Packet = LiteralPacket|OperatorPacket;

interface LiteralPacket {
  header: PacketHeader;
  content: number;
  totalBits: number;
}
interface OperatorPacket {
  header: PacketHeader;
  content: Packet[];
  totalBits: number;
}

await solver(input => input.raw.split(''), {
  expectedTestResults: {
    part1: 20,
    part2: 1,
  },

  part1: input => {
    const state: ParserState = {message: input.parsed, bits: ''};
    const packet = readPacket(state);
    if (packet === undefined) {
      return undefined
    }
    return packetVersionSum([packet]);
  },

  part2: input => {
    const state: ParserState = {message: input.parsed, bits: ''};
    const packet = readPacket(state);
    if (packet === undefined) {
      return undefined
    }
    return evaluatePacket(packet);
  },
});

function readPacket(state: ParserState): Packet|undefined {
  if (state.bits.length < 3 && state.message.length === 0) {
    return undefined;
  }
  const version = binToDec(readBits(state, 3));
  let bitsRead = 3;
  if (version === 0 && !state.bits.includes('1') && state.message.length === 0) {
    return undefined;
  }
  const packetType: PacketType = binToDec(readBits(state, 3));
  bitsRead += 3;
  const header: PacketHeader = {version, type: packetType, headerBits: bitsRead};
  if (header.type === PacketType.LITERAL) {
    return readLiteral(header, state);
  } else {
    return readOperator(header, state);
  }
}

function readLiteral(header: PacketHeader, state: ParserState): LiteralPacket {
  let currentBits = '';
  let totalBits = '';
  let bitsRead = 0;
  while (currentBits[0] !== '0') {
    currentBits = readBits(state, 5);
    bitsRead += 5;
    totalBits += currentBits.substr(1);
  }
  const content = parseInt(totalBits, 2);
  return {header, content, totalBits: bitsRead + header.headerBits};
}

function readOperator(header: PacketHeader, state: ParserState): OperatorPacket {
  const lengthTypeId = readBits(state, 1);
  let bitsRead = 1;

  let subpacketBitLength: number;
  let subpacketCount: number;
  const subpackets: Packet[] = [];

  let subpacketBits = 0;
  if (lengthTypeId === '0') {
    subpacketBitLength = binToDec(readBits(state, 15));
    bitsRead += 15;
    while (subpacketBits !== subpacketBitLength) {
      const subpacket = readPacket(state)!;
      subpacketBits += subpacket.totalBits;
      subpackets.push(subpacket);
    }
  } else {
    subpacketCount = binToDec(readBits(state, 11));
    bitsRead += 11;
    for (let i = 0; i < subpacketCount; i++) {
      const subpacket = readPacket(state)!;
      subpacketBits += subpacket.totalBits;
      subpackets.push(subpacket);
    }
  }
  bitsRead += subpacketBits;
  return {header, content: subpackets, totalBits: bitsRead + header.headerBits};
}

function hexToBin(hex: string) {
  return parseInt(hex, 16).toString(2).padStart(hex.length * 4, '0');
}

function binToDec(binary: string) {
  return parseInt(binary, 2);
}

function readBits(state: ParserState, numBits: number) {
  const bitsNeeded = numBits - state.bits.length;
  const hexNeeded = Math.ceil(bitsNeeded / 4);
  if (hexNeeded > 0) {
    const hexArray = state.message.splice(0, hexNeeded);
    if (hexNeeded > hexArray.length) {
      throw new Error(`Unexpected end of hex: wanted ${hexNeeded} hex but got '${hexArray.join('')}'`);
    }
    const bits = hexToBin(hexArray.join(''));
    state.bits += bits;
  }
  if (numBits > state.bits.length) {
    throw new Error(`Unexpected end of binary: wanted ${numBits} bits but got '${state.bits}'`);
  }
  const bits = state.bits.substr(0, numBits);
  state.bits = state.bits.substr(numBits);
  return bits;
}

function packetVersionSum(packets: Packet[]) {
  let sum = 0;
  for (const packet of packets) {
    sum += packet.header.version;
    if (Array.isArray(packet.content)) {
      sum += packetVersionSum(packet.content);
    }
  }
  return sum;
}

function evaluatePacket(packet: Packet): number {
  const subpacketValues: number[] = [];
  if (Array.isArray(packet.content)) {
    for (const subpacket of packet.content) {
      const subpacketValue = evaluatePacket(subpacket);
      subpacketValues.push(subpacketValue);
    }
  }
  switch (packet.header.type) {
    case PacketType.LITERAL:
     return packet.content as number;
    case PacketType.SUM:
     return sum(subpacketValues);
    case PacketType.PRODUCT:
     return product(subpacketValues);
    case PacketType.MINIMUM:
     return Math.min(...subpacketValues);
    case PacketType.MAXIMUM:
     return Math.max(...subpacketValues);
    case PacketType.GREATER_THAN:
      return (subpacketValues[0] > subpacketValues[1]) ? 1 : 0;
    case PacketType.LESS_THAN:
      return (subpacketValues[0] < subpacketValues[1]) ? 1 : 0;
    case PacketType.EQUAL_TO:
      return (subpacketValues[0] === subpacketValues[1]) ? 1 : 0;
  }
}