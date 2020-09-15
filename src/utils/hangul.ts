import { disassemble } from 'hangul-js';

export const extractJAMO = (hangul: string): string => disassemble(hangul).join('');

const breakCHO = (hangul: string): string => disassemble(hangul)[0];
export const extractCHO = (hangul: string): string => [...hangul].map(breakCHO).join('');
