import { convertTextToList } from '../utils/convertTextToList';

const replacePairs = [
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
  ['zero', 0],
] as const;

const calculateCalibration = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);

  const commonPattern = replacePairs.map(([d]) => d).join('|');

  return list.reduce((sum, line) => {
    const simplified = (line + line).replace(
      RegExp(`.*?(${commonPattern}|\\d).*(${commonPattern}|\\d)`),
      '$1$2'
    );

    return (
      sum +
      parseInt(
        replacePairs.reduce((rep, [t, r]) => rep.replace(RegExp(`${t}`, 'g'), `${r}`), simplified)
      )
    );
  }, 0);
};

export default calculateCalibration;
