let scanner;
let scannedCodes = {};

document.getElementById('startScan').addEventListener('click', function() {
    scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function(content) {
        if (scannedCodes[content]) {
            scannedCodes[content]++;
        } else {
            scannedCodes[content] = 1;
        }
        displayResults();
    });
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
            alert('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
        alert(e);
    });
});

document.getElementById('exportData').addEventListener('click', function() {
    let data = '';
    for (const code in scannedCodes) {
        data += `${code}: ${scannedCodes[code]}\n`;
    }
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'scanned_data.txt');
});

function displayResults() {
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';
    for (const code in scannedCodes) {
        const listItem = document.createElement('li');
        listItem.textContent = `${code}: ${scannedCodes[code]}`;
        resultsList.appendChild(listItem);
    }
}
