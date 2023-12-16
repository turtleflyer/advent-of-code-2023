import { readFileSync } from 'node:fs';

export const convertTextToList = (filePath: string) => {
  const input = readFileSync(filePath, { encoding: 'utf8' });

  const list = input.split(/[\r\n]+/);

  /**
   * Remove a possible empty last line
   */
  list[list.length - 1] === '' && list.pop();

  return list;
};
