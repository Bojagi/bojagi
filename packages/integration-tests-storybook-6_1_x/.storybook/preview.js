
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}

export const decorators = [(Story, {globals, args}) => {
  return <div style={{color: globals.fontColor}}><Story /></div>;
}];

export const globalTypes = {
  fontColor: {
    defaultValue: 'blue',
  },
}
