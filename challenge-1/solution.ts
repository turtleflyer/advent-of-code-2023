import { convertTextToList } from '../utils/convertTextToList';

const calculateCalibration = (dataFile: string) => {
  const list = convertTextToList(dataFile);

  return list.reduce(
    (sum, line, i) => {
      const parsed = (line + line).replace(/^.*?(\d).*(\d).*/, '$1$2')!;

      if (!parsed || parsed.length !== 2) throw Error(`Wrong data on line ${i + 1}: ${line}`);

      return sum + parseInt(parsed);
    },

    0
  );
};

export default calculateCalibration;
