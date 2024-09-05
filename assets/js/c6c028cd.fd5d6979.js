"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6],{25:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>s,toc:()=>l});var t=r(1085),o=r(1184);const a={sidebar_position:4},i="Types",s={id:"Airport/types",title:"Types",description:"Type LocaleText in the guide is equivalent to T[number](string) in the source code.",source:"@site/docs/Airport/types.md",sourceDirName:"Airport",slug:"/Airport/types",permalink:"/airport/docs/Airport/types",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"API",permalink:"/airport/docs/Airport/API"},next:{title:"LS-Manager",permalink:"/airport/docs/category/ls-manager"}},c={},l=[{value:"Options",id:"options",level:3},{value:"ImprovedNumberFormatOptions",id:"improvednumberformatoptions",level:3},{value:"LocaleMap",id:"localemap",level:3},{value:"CurrencyMap",id:"currencymap",level:3},{value:"TimezoneDataMap",id:"timezonedatamap",level:3}];function p(e){const n={blockquote:"blockquote",code:"code",h1:"h1",h3:"h3",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"types",children:"Types"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["Type ",(0,t.jsx)(n.code,{children:"LocaleText"})," in the guide is equivalent to ",(0,t.jsx)(n.code,{children:"T[number]"}),"(",(0,t.jsx)(n.code,{children:"string"}),") in the source code."]}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"options",children:"Options"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:"interface Options<T extends ReadonlyArray<string>, G extends LS<T> = {}> {\n  supportedLocales: T\n  locale: T[number]\n  fallbackLocale: T[number]\n  name?: string\n  globalLS?: G\n  currency?: LocaleMap<T, CurrencyType>\n  currencyFormatValueKey?: string\n  currencyFormat?: CurrencyMap<string>\n  keyCurrency?: CurrencyType\n  exchangeRate?: CurrencyMap<number>\n  timezone?: TimezoneType\n  timezoneData?: TimezoneDataMap\n  localTimezoneOnly?: boolean\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"improvednumberformatoptions",children:"ImprovedNumberFormatOptions"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:"interface ImprovedNumberFormatOptions extends Intl.NumberFormatOptions {\n  roundingMode?: RoundingMode // 'ceil' | 'floor' | 'round'\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"localemap",children:"LocaleMap"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-tsx",children:"type LocaleMap<T extends ReadonlyArray<string>, V> = {\n  [locale in T[number]]: V\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"currencymap",children:"CurrencyMap"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"type CurrencyMap<T> = {\n  [currency in CurrencyType]?: T\n}\n"})}),"\n",(0,t.jsx)(n.h3,{id:"timezonedatamap",children:"TimezoneDataMap"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"type TimezoneDataMap = {\n  [timezone in TimezoneType]: TimezoneData | number\n}\n"})})]})}function d(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(p,{...e})}):p(e)}},1184:(e,n,r)=>{r.d(n,{R:()=>i,x:()=>s});var t=r(4041);const o={},a=t.createContext(o);function i(e){const n=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),t.createElement(a.Provider,{value:n},e.children)}}}]);