function createMessage(violation) {
    return violation.map(item => 
        Object.keys(item).map(key => `${key}: ${Array.isArray(item[key]) ? item[key].join('\n') : item[key]}`).join('\n')
    ).join('\n\n');
}

function formatLicensePlate(bienSoXe) {
    bienSoXe = bienSoXe.toUpperCase();
    const formatted = bienSoXe.replace(/(\d{2}[A-Z]{1}\d{1})(\d{1})(\d{3})(\d{2})/, "$1-$2$3$4");
    return formatted;
}

async function fetchData(bienSoXe) {
    const url = 'https://api.checkphatnguoi.vn/phatnguoi';

    const payload = new URLSearchParams();
    for (let key in bienSoXe) {
        payload.append(key, bienSoXe[key]);
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: payload,
        });

        const data = await response.json();
        document.getElementById('loading').style.display = 'none';
        const resultContainer = document.getElementById('result');
        resultContainer.style.display = 'block';

        if (data && data.data) {
            const violationData = data.data;
            resultContainer.innerText = createMessage(violationData);  
            resultContainer.classList.add('has-data');
            resultContainer.classList.remove('no-data');
        } else {
            const formattedPlate = formatLicensePlate(bienSoXe.bienso);
            resultContainer.innerText = `Không tìm thấy dữ liệu phạt cho biển số: ${formattedPlate}`;
            resultContainer.classList.add('no-data');
            resultContainer.classList.remove('has-data');
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        const resultContainer = document.getElementById('result');
        resultContainer.style.display = 'block';
        resultContainer.innerText = `Lỗi: ${error.message}`;
        resultContainer.classList.add('has-data');
        resultContainer.classList.remove('no-data');
    }
}

async function run() {
    const bienSoXeInput = document.getElementById('licensePlateInput').value;

    if (!bienSoXeInput.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo!',
            text: 'Vui lòng nhập biển số xe.',
        });
        return;
    }

    const bienSoXe = {
        bienso: bienSoXeInput.trim()
    };

    document.getElementById('loading').style.display = 'flex';
    document.getElementById('result').style.display = 'none';

    await fetchData(bienSoXe);
}
