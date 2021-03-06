import * as React from 'react';
import * as path from 'path';
// import Link from 'ink-link';
import { Box, Text } from 'ink';

import { useConfig } from '../../config/configContext';
import { getFS } from '../../dependencies';
import { Config } from '../../config';
import { ErrorMessage, SimpleError } from '../../components/ErrorMessage';
import { Question, Inkuirer } from '../../components/Inkuirer';
import { createDecorator } from './createDecorator';
import { writeBojagiRc } from './writeBojagiRc';

const fs = getFS();

const REQUIRED_FILES: [string, string][] = [
  [
    'package.json',
    'You are not running this command in a node project. Please run this command in a folder that contains a package.json file.',
  ],
];

const QUESTIONS: Question[] = [
  {
    type: 'input',
    name: 'storyPath',
    message: '💾 Where are your stories located? (Please provide glob pattern)',
    default: 'src/**/*.stories.@(jsx|js|tsx|ts)',
  },
  // {
  //   type: 'select',
  //   name: 'createDecorator',
  //   message: (
  //     <Text>
  //       📸 Should I create a boilerplate global decorator (
  //       <Link url="https://bojagi.io/docs/stories/#decorators">see docs</Link>)?
  //     </Text>
  //   ),
  //   items: [
  //     {
  //       label: 'Yes',
  //       value: true,
  //     },
  //     {
  //       label: 'No',
  //       value: false,
  //     },
  //   ],
  //   default: true,
  // },
];

export function InitContainer() {
  const config = useConfig();
  const [answers, setAnswer] = React.useState<any>();
  const [done, setDone] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (answers) {
      writeBojagiRc(fs, config.executionPath, answers);
      if (answers.createDecorator) {
        createDecorator(fs, config.executionPath);
      }
      setDone(true);
    }
  }, [answers, config.executionPath]);

  const packageJsonExists = checkFileExistence(REQUIRED_FILES, config);
  const nonExistingFiles = packageJsonExists.filter(([_fileName, exists]) => !exists);

  if (nonExistingFiles.length > 0) {
    process.exitCode = 1;
    return (
      <>
        <ErrorMessage error={new SimpleError(nonExistingFiles[0][2])} />
      </>
    );
  }

  if (answers) {
    return (
      <Box margin={2} flexDirection="column">
        <Text>{done ? '🙌  Your project is set up for Bojagi now' : '📚 Writing configs'}</Text>
      </Box>
    );
  }

  return (
    <Box margin={2} flexDirection="column">
      <Box marginBottom={1}>
        <Text>Setting up Bojagi in your project 🏗</Text>
      </Box>
      <Inkuirer questions={QUESTIONS} onCompletion={setAnswer} />
    </Box>
  );
}

function checkFileExistence(
  fileNames: [string, string][],
  config: Config
): [string, boolean, string][] {
  return fileNames.map(([fileName, message]) => [
    fileName,
    fs.existsSync(path.join(config.executionPath, fileName)),
    message,
  ]);
}
