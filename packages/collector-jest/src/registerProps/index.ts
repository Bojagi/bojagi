import { addProps } from '@bojagi/collector-base';
import registerPropsFactory from './registerProps';
import { GENERATOR_NAME } from '../constants';

export default registerPropsFactory({ addProps: addProps(GENERATOR_NAME) });
