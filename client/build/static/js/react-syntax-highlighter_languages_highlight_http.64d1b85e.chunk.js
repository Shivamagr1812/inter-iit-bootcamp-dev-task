(self.webpackChunkgpt4_app=self.webpackChunkgpt4_app||[]).push([[7794],{6376:e=>{function n(){for(var e=arguments.length,n=new Array(e),a=0;a<e;a++)n[a]=arguments[a];return n.map((e=>{return(n=e)?"string"===typeof n?n:n.source:null;var n})).join("")}e.exports=function(e){const a="HTTP/(2|1\\.[01])",s={className:"attribute",begin:n("^",/[A-Za-z][A-Za-z0-9-]*/,"(?=\\:\\s)"),starts:{contains:[{className:"punctuation",begin:/: /,relevance:0,starts:{end:"$",relevance:0}}]}},t=[s,{begin:"\\n\\n",starts:{subLanguage:[],endsWithParent:!0}}];return{name:"HTTP",aliases:["https"],illegal:/\S/,contains:[{begin:"^(?="+a+" \\d{3})",end:/$/,contains:[{className:"meta",begin:a},{className:"number",begin:"\\b\\d{3}\\b"}],starts:{end:/\b\B/,illegal:/\S/,contains:t}},{begin:"(?=^[A-Z]+ (.*?) "+a+"$)",end:/$/,contains:[{className:"string",begin:" ",end:" ",excludeBegin:!0,excludeEnd:!0},{className:"meta",begin:a},{className:"keyword",begin:"[A-Z]+"}],starts:{end:/\b\B/,illegal:/\S/,contains:t}},e.inherit(s,{relevance:0})]}}}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_highlight_http.64d1b85e.chunk.js.map