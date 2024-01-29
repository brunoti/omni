
# @exelcia/pipe

Pipe as in the way it should be. This is based on [fp-ts](https://github.com/gcanti/fp-ts). It also includes a custom
Error object that traces the information of where it happened to facilitate debugging.

## How to use

```typescript
import { pipe } from '@excelsia/pipe';

const len = (s: string): number => s.length
const double = (n: number): number => n * 2

// without pipe
double(len('aaa')) === 6 // true

// with pipe
pipe('aaa', len, double) === 6 // true
```

## **About the Author**

Hi, I'm **bop**, a software engineer who loves to learn and create new stuff. Connect with me to stay updated on what I'm doing and my projects.

🌐 **Website:** [bop.systems](https://bop.systems)
📧 **Email:** [brunooliveira37@hotmail.com](mailto:brunooliveira37@hotmail.com)

📱 **Social Media:**
  - [Twitter](https://twitter.com/original_bop)
  - [LinkedIn](https://www.linkedin.com/in/bruno-oliveira-de-paula-7175699a/)
  - [GitHub](https://github.com/brunoti)
  - [dev.to](https://dev.to/bop)

*You can also [buy me a coffee](https://www.buymeacoffee.com/bopdev) to support me, if you like what I do*
