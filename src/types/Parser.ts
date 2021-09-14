import { InputData } from './InputData';
import { MetaData } from './MetaData';
import { Client } from './Client';

export type Parser = (data: InputData) => {
  meta: MetaData;
  result: Record<string, Client>;
};
