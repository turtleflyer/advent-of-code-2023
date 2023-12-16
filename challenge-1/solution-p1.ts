import { convertTextToList } from '../utils/convertTextToList';

const calculateCalibration = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);

  return list.reduce(
    (sum, line) => sum + parseInt((line + line).replace(/.*?(\d).*(\d)/, '$1$2')),
    0
  );
};

export default calculateCalibration;
