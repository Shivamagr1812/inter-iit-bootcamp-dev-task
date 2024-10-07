import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import ClipboardJS from 'clipboard';
import 'prismjs/themes/prism-tomorrow.css';
import '../css/Codeblock.css'; //Styling codeblocs using codeblock component

const CodeBlock = ({ code, language }) => {
	const codeRef = useRef(null);

	useEffect(() => {
		Prism.highlightAll(); // Highlighting

		const clipboard = new ClipboardJS('.copy-btn', {
			target: () => codeRef.current,
		});

		return () => {
			clipboard.destroy();
		};
	}, [code, language]);

	return (
		<div className='code-block'>
			<pre>
				<code ref={codeRef} className={`language-${language}`}>
					{code}
				</code>
			</pre>
			<button className='copy-btn' data-clipboard-target={`#code-snippet`}>
				Copy
			</button>
		</div>
	);
};

export default CodeBlock;
