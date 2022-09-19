import { pipe } from 'https://unpkg.com/@excelsia/pipe@1.0.0/dist/index.js'

const main = async () => {
  console.log(pipe)
  
  // const lastColumnSpendings = () => pipe(
  //   dom.last('.charges.column', document.body),
  //   maybe.map(dom.all('.charge')),
  //   maybe.map(list.map(element => ({
  //     date: pipe(dom.one('.date', element), maybe.map(prop('textContent')), maybe.fold),
  //     description: pipe(dom.one('.description', element), maybe.map(prop('textContent')), maybe.fold),
  //     value: pipe(
  //       dom.one('.amount', element),
  //       tap('amount'),
  //       maybe.map(prop('textContent')),
  //       tap('textContent'),
  //       maybe.map(replaceAll('.', '')),
  //       maybe.map(replace(',', '.')),
  //       maybe.map(Number),
  //       maybe.fold,
  //     ),
  //   }))),
  //   maybe.fold,
  // );
  
  
  // window.lastColumnSpendings = lastColumnSpendings;
};

setTimeout(main, 2000);
