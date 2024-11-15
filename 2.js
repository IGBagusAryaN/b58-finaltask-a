const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function hitungVoucher(voucher, totalBelanja) {
    let diskon = 0;
    let minimumBelanja = 0;
    let maksimalDiskon = 0;
    let persenDiskon = 0;

    if (voucher === "DumbwaysJos") {
        persenDiskon = 21.1 / 100;
        minimumBelanja = 50000;
        maksimalDiskon = 20000;
    } else if (voucher === "DumbwaysMantap") {
        persenDiskon = 30 / 100;
        minimumBelanja = 80000;
        maksimalDiskon = 40000;
    } else {
        console.log("Voucher tidak valid.");
        return null;
    }

    if (totalBelanja >= minimumBelanja) {
        diskon = totalBelanja * persenDiskon;
        if (diskon > maksimalDiskon) {
            diskon = maksimalDiskon;
        }
    }

    const totalBayar = totalBelanja - diskon;
    return {
        totalBayar: totalBayar,
        diskon: diskon,
        kembalian: totalBelanja - totalBayar
    };
}

rl.question("Masukkan jenis voucher (DumbwaysJos atau DumbwaysMantap): ", function(voucher) {
    rl.question("Masukkan total belanja: ", function(totalBelanja) {
        totalBelanja = parseFloat(totalBelanja);

        const hasil = hitungVoucher(voucher, totalBelanja);

        if (hasil) {
            console.log("Uang yang harus dibayar: " + hasil.totalBayar);
            console.log("Diskon: " + hasil.diskon);
            console.log("Kembalian: " + hasil.kembalian);
        }

        rl.close();
    });
});
