import * as MemoryFS from 'memory-fs';

export const fs = new MemoryFS();
// import * as fs from 'fs';

export const getFS = () => fs;
