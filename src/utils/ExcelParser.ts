import { TPeriod } from '../types/parser/TPeriod';
import { InputData } from '../types/parser/InputData';
import { TMeta } from '../types/parser/TMeta';

type HeaderField = Record<
  string,
  {
    label: string;
    dataGetter?: (value: any) => any;
  }
>;

type TableHeader = Record<keyof HeaderField, number>;

// type TableContent<Row> = Record<keyof TableHeader, Row>;

export type ParserResponse<Row> = {
  meta: TMeta;
  data: Row[];
};

class ExcelParser<Row> {
  private readonly data: InputData;
  private readonly headerFieldsName: HeaderField = {};
  private tableHeader: TableHeader = {};
  private period: TPeriod = { start: undefined, end: undefined };
  private resultParse: Row[] = [];

  constructor(data: InputData, headerFields: HeaderField) {
    this.data = data;
    this.headerFieldsName = { ...headerFields };
  }

  private parsePeriod(string: string): void {
    const regexp = /(\d{2})\.(\d{2})\.(\d{4})/g;
    const matches = string.matchAll(regexp);

    while (true) {
      const value = matches.next();
      if (value.done) break;

      const [, day, month, year] = value.value;
      const date = new Date(+year, +month - 1, +day);

      if (!this.period.start) {
        this.period.start = date;
      } else if (!this.period.end) {
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        this.period.end = date;
      }
    }
  }

  private parseHeader(row: (string | number | null)[]): void {
    const headerEntries = Object.entries(this.headerFieldsName);

    for (let i = 0; i < row.length; i++) {
      const column = row[i];

      if (!column || typeof column === 'number') continue;

      const idx = headerEntries.findIndex(([, value]) =>
        column.includes(value.label)
      );

      if (idx < 0) continue;

      this.tableHeader[headerEntries[idx][0]] = i;
    }
  }

  private parseTableContentRow(row: (string | number | null)[]): void {
    if (!row[0]) return;

    const rowData: Record<keyof TableHeader, any> = {};

    for (const field in this.tableHeader) {
      const dataGetter = this.headerFieldsName[field]?.dataGetter;

      rowData[field] = dataGetter
        ? dataGetter(row[this.tableHeader[field]])
        : row[this.tableHeader[field]];
    }

    this.resultParse.push(rowData as Row);
  }

  public async parse(): Promise<ParserResponse<Row>> {
    let parseContentMode = false;

    for (let rowIdx = 0; rowIdx < this.data.length; rowIdx++) {
      const row = this.data[rowIdx];

      if (/^Итого$/gi.test(String(row[0]))) break;

      if (parseContentMode) {
        this.parseTableContentRow(row);
        continue;
      }

      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const cellValue = row[colIdx];

        if (!cellValue || typeof cellValue === 'number') continue;

        if (/Период:/gi.test(cellValue)) {
          this.parsePeriod(cellValue);
        }

        if (/Реализация/gi.test(cellValue)) {
          this.parseHeader(row);
          parseContentMode = true;
          break;
        }
      }
    }

    return {
      meta: {
        period: this.period,
        rows: this.resultParse.length,
      },
      data: this.resultParse,
    };
  }
}

export default ExcelParser;
