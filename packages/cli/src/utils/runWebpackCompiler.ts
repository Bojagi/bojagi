const runWebpackCompiler = ({ compiler, entrypoints }) =>
  new Promise((resolve, reject) => {
    compiler.run((err, output) => {
      if (err) {
        reject(err);
      }

      const components = Object.keys(entrypoints);
      const componentsContent = [...components, 'commons'].reduce(
        (contents, componentName) => {
          const content = compiler.outputFileSystem
            .readFileSync(`${process.cwd()}/bojagi/${componentName}.js`)
            .toString();
          contents[componentName] = content;
          return contents;
        },
        {}
      );

      resolve(componentsContent);
    });
  });

export default runWebpackCompiler;
