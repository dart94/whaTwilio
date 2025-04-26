import * as fs from 'fs';
import * as path from 'path';

export const loadTemplate = (template: string) => {
  const fileName = template === '1' ? 'template1.txt' : 'template2.txt';
  const filePath = path.resolve(__dirname, '../../', fileName);
  return fs.readFileSync(filePath, 'utf8');
};
export const replaceTemplate = (template: string, data: { [key: string]: string }) => {
  return template.replace(/\{\{(\d+)\}\}/g, (_, p1) => data[p1] || '');
};
