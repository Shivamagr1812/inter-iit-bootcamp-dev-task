(self.webpackChunkgpt4_app=self.webpackChunkgpt4_app||[]).push([[6354],{4136:e=>{var n="[0-9](_*[0-9])*",a=`\\.(${n})`,s="[0-9a-fA-F](_*[0-9a-fA-F])*",i={className:"number",variants:[{begin:`(\\b(${n})((${a})|\\.)?|(${a}))[eE][+-]?(${n})[fFdD]?\\b`},{begin:`\\b(${n})((${a})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${a})[fFdD]?\\b`},{begin:`\\b(${n})[fFdD]\\b`},{begin:`\\b0[xX]((${s})\\.?|(${s})?\\.(${s}))[pP][+-]?(${n})[fFdD]?\\b`},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${s})[lL]?\\b`},{begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],relevance:0};e.exports=function(e){var n="[\xc0-\u02b8a-zA-Z_$][\xc0-\u02b8a-zA-Z_$0-9]*",a=n+"(<"+n+"(\\s*,\\s*"+n+")*>)?",s="false synchronized int abstract float private char boolean var static null if const for true while long strictfp finally protected import native final void enum else break transient catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private module requires exports do",r={className:"meta",begin:"@"+n,contains:[{begin:/\(/,end:/\)/,contains:["self"]}]};const t=i;return{name:"Java",aliases:["jsp"],keywords:s,illegal:/<\/|#/,contains:[e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{begin:/\w+@/,relevance:0},{className:"doctag",begin:"@[A-Za-z]+"}]}),{begin:/import java\.[a-z]+\./,keywords:"import",relevance:2},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{className:"class",beginKeywords:"class interface enum",end:/[{;=]/,excludeEnd:!0,relevance:1,keywords:"class interface enum",illegal:/[:"\[\]]/,contains:[{beginKeywords:"extends implements"},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"new throw return else",relevance:0},{className:"class",begin:"record\\s+"+e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,excludeEnd:!0,end:/[{;=]/,keywords:s,contains:[{beginKeywords:"record"},{begin:e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,relevance:0,contains:[e.UNDERSCORE_TITLE_MODE]},{className:"params",begin:/\(/,end:/\)/,keywords:s,relevance:0,contains:[e.C_BLOCK_COMMENT_MODE]},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"function",begin:"("+a+"\\s+)+"+e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:s,contains:[{begin:e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,relevance:0,contains:[e.UNDERSCORE_TITLE_MODE]},{className:"params",begin:/\(/,end:/\)/,keywords:s,relevance:0,contains:[r,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,t,e.C_BLOCK_COMMENT_MODE]},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},t,r]}}}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_highlight_java.55ebff6d.chunk.js.map