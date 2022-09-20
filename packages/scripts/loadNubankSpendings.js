import { pipe, safe } from 'https://unpkg.com/@excelsia/general-helpers@latest/esm/index.js';
import { prop, trim, replace } from 'https://unpkg.com/rambda@7.2.1/dist/rambda.mjs';
import * as dom from 'https://unpkg.com/@excelsia/dom@1.0.0/dist/index.js'

const main = async () => {
  const lastColumnSpendings = (table) => pipe(
    table,
    safe.map(dom.all('.charge')),
    safe.map(list => list.map(element => ({
      date: pipe(dom.first('.date', element), safe.map(prop('textContent'))),
      description: pipe(dom.first('.description', element), safe.map(prop('textContent')), safe.map(trim)),
      value: pipe(
        dom.first('.amount', element),
        safe.map(prop('textContent')),
        safe.map(replace(/\./g, '')),
        safe.map(replace(',', '.')),
        safe.map(Number),
      ),
    }))),
  );
  
  
  window.lastColumnSpendings = lastColumnSpendings;
};

setTimeout(main, 2000);
