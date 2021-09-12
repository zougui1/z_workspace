import * as uuid from "uuid";

import { tokenTypes } from '../../Token';

export enum NodeTypes {
  array = 'array',
  string = 'string',
  number = 'number',
  bigint = 'bigint',
  boolean = 'boolean',
  symbol = 'symbol',
  undefined = 'undefined',
  object = 'object',
  function = 'function',
  token = 'token',
  composed = 'composed',
  propertyName = 'propertyName',
}

export enum BlockTypes {
  start = 'start',
  end = 'end',
}

interface Block {
  id: string;
  type: BlockTypes;
  lineCount?: number;
}

export interface ComposedNode {
  type: NodeTypes.composed;
  indentLevel: number;
  parts: NodePart[];
}

export type BlockNode = LineNode & {
  block: Block;
};


export type NodePart = ValueNode & {
  block?: Block;
  partNumber: number;
}

export interface ValueNode {
  type: NodeTypes;
  indentLevel?: number;
  value: any;
}

export type LineNode = ComposedNode | NodePart | ValueNode;
export type Node = LineNode | BlockNode;
export type CodeNode = Node & { lineNumber: number; closed?: boolean };

const processObject = (object: Record<string, any>, indentLevel: number): Node[] => {
  return Object.entries(object).flatMap(([name, value], i, sourceArray) => {
    const processedNodes = processData(value, indentLevel);
    const [node, ...nodes] = processedNodes;

    const startingNode: ComposedNode & { block?: BlockNode['block'] } = {
      type: NodeTypes.composed,
      indentLevel,
      parts: [
        {
          type: NodeTypes.propertyName,
          value: `"${name}"`,
          partNumber: 0,
        },
        {
          type: NodeTypes.token,
          value: tokenTypes[':'],
          partNumber: 1,
        },
        {
          type: NodeTypes.token,
          value: tokenTypes[' '],
          partNumber: 2,
        },
        {
          ...(node as ValueNode),
          partNumber: 3,
        },
      ],
    };

    if ('block' in node) {
      //startingNode.block = node.block;
    }

    const allNodes = [startingNode, ...nodes];
    if (i < (sourceArray.length - 1)) {
      if (typeof value === 'object') {
        const lastNode = allNodes.pop();

        if (lastNode) {
          allNodes.push(addComma(lastNode));
        }
      } else {
        startingNode.parts.push(createCommaPart(startingNode.parts.length));
      }
    }

    return allNodes;
  });
}

const createCommaPart = (partNumber: number): NodePart => {
  const newPart: NodePart = {
    type: NodeTypes.token,
    value: tokenTypes[','],
    partNumber,
  };

  return newPart;
}

const addComma = (node: Node): ComposedNode => {
  const dirtyLastParts = 'parts' in node ? node.parts : [node];
  const lastParts: NodePart[] = dirtyLastParts.map((part, i) => ({
    ...part,
    partNumber: 'partNumber' in part ? part.partNumber : i,
  }));
  const [firstLastPart] = lastParts;
  const lastLastPart = lastParts[lastParts.length - 1];

  const newPart = createCommaPart(lastParts.length);

  const composedNode: ComposedNode & { block?: BlockNode['block'] } = {
    type: NodeTypes.composed,
    indentLevel: node.indentLevel ?? 0,
    parts: [...lastParts, newPart]
  };

  if ('block' in firstLastPart) {
    //composedNode.block = firstLastPart.block;
  } else if ('block' in lastLastPart) {
    //composedNode.block = lastLastPart.block;
  }

  return composedNode;
}

const processArray = (array: any[], indentLevel: number): Node[] => {
  return array.flatMap((item, i) => {
    const nodes = processData(item, indentLevel);
    if (i < (array.length - 1)) {
      const lastNode = nodes.pop();

      if (lastNode) {
        nodes.push(addComma(lastNode));
      }
    }

    return nodes;
  });
}

const processValue = (value: any, indentLevel: number): Node => {
  const type = typeof value as NodeTypes;

  return {
    type,
    value: type === 'string' ? `"${value}"` : value,
    indentLevel,
  };
}

const processBlock = (data: Record<string, any> | any[], nodes: Node[], indentLevel: number): Node[] => {
  const isArray = Array.isArray(data);
  const startToken = isArray ? tokenTypes['['] : tokenTypes['{'];
  const endToken = isArray ? tokenTypes[']'] : tokenTypes['}'];

  let partNumber = 0;
  const blockId = uuid.v4();

  const startNode: BlockNode = {
    type: NodeTypes.token,
    indentLevel,
    value: startToken,
    partNumber: partNumber++,
    block: {
      id: blockId,
      type: BlockTypes.start,
    },
  };
  const partNodes = nodes.map(node => ({ ...node, partNumber: partNumber++ }));
  const endNode: BlockNode = {
    type: NodeTypes.token,
    indentLevel,
    value: endToken,
    partNumber: partNumber++,
    block: {
      id: blockId,
      type: BlockTypes.end,
    },
  };

  startNode.block.lineCount = partNodes.length;

  return [startNode, ...partNodes, endNode];
}

const processData = (data: any, indentLevel: number): Node[] => {
  if (!data || typeof data !== 'object') {
    return [processValue(data, indentLevel)];
  }

  const processor = Array.isArray(data) ? processArray : processObject;
  const nodes = processor(data, indentLevel + 1);

  return processBlock(data, nodes, indentLevel);
}

export const processJson = (json: Record<string, any> | any[]): CodeNode[] => {
  return processData(json, 0)
    .map((d, i) => ({ ...d, lineNumber: i + 1 }))
    .map(line => {
      if ('parts' in line) {
        const blockPart = line.parts.find(p => p.block);

        if (blockPart) {
          return {
            ...line,
            block: blockPart.block,
          };
        }
      }

      return line;
    });
}
