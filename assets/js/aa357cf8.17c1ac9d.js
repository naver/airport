"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[873],{2572:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>i,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>t,toc:()=>a});var l=r(1085),c=r(1184);const o={sidebar_position:3},s="API",t={id:"Airport/API",title:"API",description:"getOptions()",source:"@site/docs/Airport/API.md",sourceDirName:"Airport",slug:"/Airport/API",permalink:"/airport/docs/Airport/API",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Installation",permalink:"/airport/docs/Airport/installation"},next:{title:"Types",permalink:"/airport/docs/Airport/types"}},i={},a=[{value:"<code>getOptions()</code>",id:"getoptions",level:3},{value:"<code>getLocale()</code>",id:"getlocale",level:3},{value:"<code>getLanguage()</code>",id:"getlanguage",level:3},{value:"<code>getRegion()</code>",id:"getregion",level:3},{value:"<code>changeLocale(locale: LocaleText)</code>",id:"changelocalelocale-localetext",level:3},{value:"<code>t(ls, variableMap?: Record&lt;any,any&gt;, _forcedLocale?: LocaleText)</code>",id:"tls-variablemap-recordanyany-_forcedlocale-localetext",level:3},{value:"<code>fn(value: number, options?: ImprovedNumberFormatOptions, _forcedLocale?: T[number])</code>",id:"fnvalue-number-options-improvednumberformatoptions-_forcedlocale-tnumber",level:3},{value:"<code>fc(value: number, customFormat?: string, baseCurrency?: Currency, isFixedCurrency = false, _forcedLocale?: T[number])</code>",id:"fcvalue-number-customformat-string-basecurrency-currency-isfixedcurrency--false-_forcedlocale-tnumber",level:3}];function d(e){const n={code:"code",h1:"h1",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,c.R)(),...e.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(n.h1,{id:"api",children:"API"}),"\n",(0,l.jsx)(n.h3,{id:"getoptions",children:(0,l.jsx)(n.code,{children:"getOptions()"})}),"\n",(0,l.jsx)(n.p,{children:"Retrieves current airport instance's options."}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Arguments"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"none"}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Returns"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"(Option)"}),": current instance's option"]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const options = airport.getOptions()\n"})}),"\n",(0,l.jsx)(n.h3,{id:"getlocale",children:(0,l.jsx)(n.code,{children:"getLocale()"})}),"\n",(0,l.jsx)(n.p,{children:"Retrieves current locale."}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Arguments"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"none"}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Returns"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"(LocaleText)"}),": current locale in string"]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const locale = airport.getLocale()\n"})}),"\n",(0,l.jsx)(n.h3,{id:"getlanguage",children:(0,l.jsx)(n.code,{children:"getLanguage()"})}),"\n",(0,l.jsx)(n.p,{children:"Retrieves current language."}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Arguments"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"none"}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Returns"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"(string)"}),": current language in string"]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const language = airport.getLanguage()\n"})}),"\n",(0,l.jsx)(n.h3,{id:"getregion",children:(0,l.jsx)(n.code,{children:"getRegion()"})}),"\n",(0,l.jsx)(n.p,{children:"Retrieves current region."}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Arguments"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"none"}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Returns"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"(string)"}),": current region in string"]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const region = airport.getRegion()\n"})}),"\n",(0,l.jsx)(n.h3,{id:"changelocalelocale-localetext",children:(0,l.jsx)(n.code,{children:"changeLocale(locale: LocaleText)"})}),"\n",(0,l.jsx)(n.p,{children:"Change locale to desired locale."}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Arguments"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"locale(LocaleText)"}),": Any entry in ",(0,l.jsx)(n.code,{children:"supportedLocales"})," to change locale to."]}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Returns"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsx)(n.li,{children:"none"}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"const newLocale = `ko`\nairport.changeLocale(newLocale)\n"})}),"\n",(0,l.jsx)(n.h3,{id:"tls-variablemap-recordanyany-_forcedlocale-localetext",children:(0,l.jsx)(n.code,{children:"t(ls, variableMap?: Record<any,any>, _forcedLocale?: LocaleText)"})}),"\n",(0,l.jsxs)(n.p,{children:["Function that selects appropriate text from language set according to current locale. Dynamic values can be applied by passing ",(0,l.jsx)(n.code,{children:"variableMap"})," as a second parameter."]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Arguments"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"ls"})," can be any of the types below:","\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"lso(LSO)"}),": Language Set Object(LSO) that has values for all supported locales."]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"partialLso(PartialLSO)"}),": Language Set Object that has values for at least 1 supported locales."]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"globalLSKey(keyof G)"}),": key of global Langauge Set Object."]}),"\n"]}),"\n"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"variableMap(Record<any,any>)"}),"(optional): Key-value object that has values to substitute from text."]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"_forcedLocale(LocaleText)"}),"(optional): locale to apply instead of current airport instance's locale."]}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Returns"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"(string)"}),": Current locale's text from ",(0,l.jsx)(n.code,{children:"ls"}),". Returns ",(0,l.jsx)(n.code,{children:"''"})," if current locale entry doesn't exist in ",(0,l.jsx)(n.code,{children:"ls"}),"."]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"// lso\nconst createLS = createLSFactory<LocaleType>()\nconst LS = createLS({\n  helloFull: {\n    ko: '\uc548\ub155\ud558\uc138\uc694',\n    en: 'Hello',\n  },\n})\nconsole.log(airport.t(LS.helloFull))\n\n// partialLSO\nexport const createPartialLS = createLSFactory<LocaleType, false>()\nconst PartialLS = createPartialLS({\n  helloPartial: {\n    en: 'Hello',\n  }\n})\nconsole.log(airport.t(LS.helloPartial))\n\n// globalLSKey\n// Assume that airport has been initialized with global LSO that has 'hello' entry.\nconsole.log(airport.t('hello')) \n\n// dynamic variable\nexport const createPartialLS = createLSFactory<LocaleType, false>()\nconst dynamicVarLS = createPartialLS({\n  hello: {\n    en: 'Hello, {name}',\n  }\n})\nconsole.log(airport.t(dynamicVarLS.hello, { name: 'Jun' }))\n\n// forced locale\nexport const createLS = createLSFactory<LocaleType>()\nconst LS = createLS({\n  hello: {\n    ko: '\uc548\ub155\ud558\uc138\uc694',\n    en: 'Hello',\n  }\n})\nconsole.log(airport.t(LS.hello, undefined, 'ko'))\n"})}),"\n",(0,l.jsx)(n.h3,{id:"fnvalue-number-options-improvednumberformatoptions-_forcedlocale-tnumber",children:(0,l.jsx)(n.code,{children:"fn(value: number, options?: ImprovedNumberFormatOptions, _forcedLocale?: T[number])"})}),"\n",(0,l.jsx)(n.p,{children:"Formats given number value appropriate to current locale"}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Arguments"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"value(number)"}),": number to format"]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"options(ImprovedNumberFormatOptions)"}),"(optional): options for format with extra options added from ",(0,l.jsx)(n.code,{children:"Intl.NumberFormatOptions"})]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"_forcedLocale(LocaleText)"}),"(optional): custom locale to apply instead of current locale."]}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Returns"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"(string)"}),": formatted number in current locale's number format."]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"console.log(airport.fn(10000))\n"})}),"\n",(0,l.jsx)(n.h3,{id:"fcvalue-number-customformat-string-basecurrency-currency-isfixedcurrency--false-_forcedlocale-tnumber",children:(0,l.jsx)(n.code,{children:"fc(value: number, customFormat?: string, baseCurrency?: Currency, isFixedCurrency = false, _forcedLocale?: T[number])"})}),"\n",(0,l.jsxs)(n.p,{children:["Formats given number to current locale's currency.\n(Uses ",(0,l.jsx)(n.code,{children:"Option.currencyMap"}),", ",(0,l.jsx)(n.code,{children:"Option.currencyFormatValueKey"}),",",(0,l.jsx)(n.code,{children:"Option.currencyFormat"}),")"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Arguments"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"value(number)"}),": number to format as currency."]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"customFormat(string)"}),"(optional): custom format to apply instead of ",(0,l.jsx)(n.code,{children:"Option.currencyFormat"}),"."]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"baseCurrency(Currency)"}),"(optional): currency of ",(0,l.jsx)(n.code,{children:"value"}),". ",(0,l.jsx)(n.code,{children:"baseCurrency"})," is required if ",(0,l.jsx)(n.code,{children:"isFixedCurrency"})," is ",(0,l.jsx)(n.code,{children:"true"}),"."]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"isFixedCurrency(boolean)"}),"(optional): if ",(0,l.jsx)(n.code,{children:"isFixedCurrency"})," is true, ",(0,l.jsx)(n.code,{children:"value"})," will not be exchanged and formatted to current locale's currency."]}),"\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"_forcedLocale(LocaleText)"}),"(optional): custom locale to apply instead of current locale."]}),"\n"]}),"\n",(0,l.jsx)(n.p,{children:(0,l.jsx)(n.strong,{children:"Returns"})}),"\n",(0,l.jsxs)(n.ul,{children:["\n",(0,l.jsxs)(n.li,{children:[(0,l.jsx)(n.code,{children:"(string)"}),": formatted number in current locale's currency."]}),"\n"]}),"\n",(0,l.jsx)(n.pre,{children:(0,l.jsx)(n.code,{className:"language-ts",children:"// Assume that airport has been constructed with following option:\n// \n// locale: 'ko-KR',\n// currency: {\n//   'ko-KR': 'KRW',\n//   'en-US': 'USD',\n// },\n// currencyFormat: {\n//   'USD': 'USD {v}',\n//   'KRW': 'KRW {v},  \n// },\n// keyCurrency: Currency.USD,\n// exchangeRate: {\n//   [Currency.USD]: 1,\n//   [Currency.KRW]: 1000,\n// }\n\n// KRW 10,000\nconsole.log(airport.fc(10000)) \n// KRW 10,000,000\nconsole.log(airport.fc(10000, undefined, USD))\n// USD 10,000\nconsole.log(airport.fc(10000, undefined, USD, true)) \n"})})]})}function u(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,l.jsx)(n,{...e,children:(0,l.jsx)(d,{...e})}):d(e)}},1184:(e,n,r)=>{r.d(n,{R:()=>s,x:()=>t});var l=r(4041);const c={},o=l.createContext(c);function s(e){const n=l.useContext(o);return l.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:s(e.components),l.createElement(o.Provider,{value:n},e.children)}}}]);