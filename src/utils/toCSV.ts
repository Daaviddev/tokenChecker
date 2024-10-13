/* eslint-disable @typescript-eslint/no-explicit-any */
import Papa from 'papaparse';

/**
 * Exports data to a CSV file.
 * @param data The data to export.
 * @param filename The name of the file to export.
 */
export const exportDataToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
