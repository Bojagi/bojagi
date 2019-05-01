import registerPropsFactory from './registerProps';
import { addProps } from '@bojagi/cli';
import { GENERATOR_NAME } from '../constants';

export default registerPropsFactory({ addProps: addProps(GENERATOR_NAME) });
