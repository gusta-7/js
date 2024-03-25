let codes = [];

function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#preview'),
            constraints: {
                width: 480,
                height: 320,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader"]
        }
    }, function (err) {
        if (err) {
            console.error(err);
            alert('Erro ao inicializar a câmera.');
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function (result) {
        let code = result.codeResult.code;
        let found = false;
        for (let item of codes) {
            if (item.codigo === code) {
                found = true;
                item.quantidade += 1;
                break;
            }
        }
        if (!found) {
            codes.push({ codigo: code, quantidade: 1 });
        }
        updateCodesList();
    });
}

function updateCodesList() {
    let list = document.getElementById('codes-list');
    list.innerHTML = '';
    codes.forEach(item => {
        let li = document.createElement('li');
        li.textContent = `Código: ${item.codigo} - Quantidade: ${item.quantidade}x`;
        list.appendChild(li);
    });
}

document.getElementById('startScan').addEventListener('click', function() {
    Quagga.stop();
    codes = [];
    updateCodesList();
    startScanner();
});

startScanner();
