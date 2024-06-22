function highlightSyntax() {
    const codeInputs = document.querySelectorAll('.code-input');

    codeInputs.forEach(input => {
        const code = input.value;

        // Resaltar etiquetas HTML
        const highlightedCode = code.replace(/&lt;([^\s>\/]+)/g, '<span class="html-tag">&lt;$1</span>')
                                   .replace(/&lt;\/([^\s>]+)\s*&gt;/g, '<span class="html-tag">&lt;/$1&gt;</span>');

        // Resaltar atributos
        const highlightedCodeWithAttributes = highlightedCode.replace(/\s([^\s=]+)=(&quot;|')([^&quot;']+)?(&quot;|')/g, ' <span class="html-attribute">$1</span>=<span class="html-value">$2$3$4</span>');

        input.innerHTML = highlightedCodeWithAttributes;
    });
}


window.onload = highlightSyntax;


document.addEventListener('input', () => {
    highlightSyntax();
});