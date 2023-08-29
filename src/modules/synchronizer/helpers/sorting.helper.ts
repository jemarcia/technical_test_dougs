interface HasDate {
  date: Date;
}

export const sortByDate = <T extends HasDate>(array: Array<T>): Array<T> => {
  return array.sort((a, b) => a.date.getTime() - b.date.getTime());
};
