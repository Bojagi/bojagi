export enum PropType {
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  STRING = 'string',
  HTML = 'html',
  FUNCTION = 'function',
  UNKNOWN = 'unknown',
}

export type PropValue = {
  type: PropType;
  value: any;
};

export function getPropTypeForValue(value: any): PropType {
  switch (typeof value) {
    case 'boolean':
      return PropType.BOOLEAN;
    case 'number':
      return PropType.NUMBER;
    case 'string':
      return PropType.STRING;
    case 'function':
      return PropType.FUNCTION;
    case 'object':
      return PropType.OBJECT;
    default:
      return PropType.UNKNOWN;
  }
}

export function createFunctionPropValue(args: any[], returnType: PropType, returnValue: any) {
  return { args, returnType, returnValue };
}

export function createProp(type: PropType, value: any): PropValue {
  if (type === PropType.OBJECT) {
    // eslint-disable-next-line no-param-reassign
    value = JSON.parse(JSON.stringify(value));
  }

  return {
    type,
    value,
  };
}
