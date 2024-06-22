async function loadConversionRules(fromVersion, toVersion) {
    const response = await fetch(`../conversions/b${fromVersion}to${toVersion}.json`);
    return await response.json();
}

function convert() {
    const fromVersion = document.getElementById('fromVersion').value;
    const toVersion = document.getElementById('toVersion').value;

    if (fromVersion === toVersion) {
        alert("The from and to versions must be different.");
        return;
    }

    loadConversionRules(fromVersion, toVersion).then(rules => {
        let inputCode = document.getElementById('inputCode').value;
        let outputCode = inputCode;

        // Convert classes
        for (const [oldClass, newClass] of Object.entries(rules.classes)) {
            const classRegex = new RegExp(`\\b${oldClass}\\b`, 'g');
            outputCode = outputCode.replace(classRegex, newClass);
        }

        // Convert attributes
        for (const [oldAttr, newAttr] of Object.entries(rules.attributes)) {
            const attrRegex = new RegExp(`\\b${oldAttr}\\b`, 'g');
            outputCode = outputCode.replace(attrRegex, newAttr);
        }

        document.getElementById('outputCode').value = outputCode;

        // Set the iframe content with Bootstrap CSS based on selected version
        const previewFrame = document.getElementById('previewFrame');
        const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;

        // Clear previous content
        previewDoc.open();
        previewDoc.close();

        // Create a new HTML document inside the iframe
        const iframeHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
                ${getBootstrapCssLink(toVersion)}
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                </style>
            </head>
            <body>
                ${outputCode}
            </body>
            </html>
        `;

        previewDoc.open();
        previewDoc.write(iframeHtml);
        previewDoc.close();
    }).catch(error => {
        console.error("Error loading conversion rules:", error);
    });
}

function getBootstrapCssLink(version) {
    switch (version) {
        case '3':
            return '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css" integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">';
        case '4':
            return '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">';
        case '5':
        default:
            return '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">';
    }
}