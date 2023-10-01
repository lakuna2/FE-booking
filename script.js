// KODE UNTUK MEMILIH DOCTOR BERDASARKAN SERVICE YANG DIPILIH

document.addEventListener('DOMContentLoaded', function () {
    const serviceSelect = document.getElementById('service');
    const doctorSelect = document.getElementById('doctor');

    // Mappings antara service dan doctor
    const doctorMap = {
        'Tooth Filling': ['Carter Dias', 'Tatiana Dias', 'Jaylon Calzoni'],
        'Tooth Whitening': ['Emery Kenter'],
        'Denture Fitting' : ['Carter Dias', 'Tatiana Dias', 'Jaylon Calzoni'],
        'Dental Health Consultation': ['Tatiana Dias', 'Jaylon Calzoni'],
        'Tooth Extraction' : ['Tatiana Dias', 'Jaylon Calzoni'],
        'Professional Scalling' : ['Philip Aminoff'],
        'Dental Check Up' : ['Tatiana Dias', 'Jaylon Calzoni'],
        'Braces Installation': ['Jocelyn Dokidis']
    };

    // Fungsi untuk memperbarui pilihan doctor berdasarkan service yang dipilih
    serviceSelect.addEventListener('change', function () {
        const selectedservice = serviceSelect.value;
        const availabledoctor = doctorMap[selectedservice] || [];

        // Hapus semua pilihan doctor yang ada
        doctorSelect.innerHTML = '';

        // Tambahkan pilihan doctor yang sesuai dengan service yang dipilih
        availabledoctor.forEach(doctor => {
            const option = document.createElement('option');
            option.textContent = doctor;
            doctorSelect.appendChild(option);
        });
    });
});

// ---------------------------------------------------------------------------------------- //

// Kode agar hari minggu tidak dapat di pilih, dikarenakan hari libur.
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("date");

    // Mengecek apakah browser mendukung notifikasi
    if ('Notification' in window) {
        Notification.requestPermission();
    }

    // Menggunakan notifikasi daripada alert
    dateInput.addEventListener("change", function () {
        const selectedDate = new Date(dateInput.value);
        if (selectedDate.getDay() === 0) {
            if (Notification.permission === 'granted') {
                const notification = new Notification("Hari Minggu Tidak Tersedia", {
                    body: "Silakan pilih tanggal lain untuk reservasi.",
                    icon: "path/to/icon.png" // Ganti dengan URL ikon Anda
                });
                
                // Bisa menambahkan event click untuk menangani tindakan lebih lanjut
                notification.onclick = function () {
                    // Lakukan tindakan setelah notifikasi diklik (jika diperlukan)
                };
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        // Notifikasi diizinkan, pilih tanggal lain
                    } else {
                        // Notifikasi ditolak
                        // Anda dapat menampilkan pesan alternatif jika notifikasi tidak diizinkan
                        alert("Silakan pilih tanggal lain untuk reservasi.");
                    }
                });
            } else {
                // Notifikasi sudah pernah ditolak, tampilkan pesan alternatif
                alert("Silakan pilih tanggal lain untuk reservasi.");
            }
            dateInput.value = ""; // Kosongkan input tanggal
        }
    });
});

  // ---------------------------------------------------------------------------------------- //

  // Fungsi ini akan dipanggil saat formulir disubmit secara manual
//   function submitForm() {
//     // Mendapatkan referensi ke elemen-elemen formulir
//     var name = document.getElementById('name').value;
//     var email = document.getElementById('email').value;
//     var phone = document.getElementById('phone').value;
//     var service = document.getElementById('service').value;
//     var doctor = document.getElementById('doctor').value;
//     var date = document.getElementById('date').value;
//     var time = document.getElementById('time').value;

//     // Mendapatkan referensi ke tabel hasil
//     var table = document.querySelector('table tbody');

//     // Membuat baris baru dalam tabel hasil
//     var newRow = table.insertRow(table.rows.length);

//     // Mengisi data dalam baris baru
//     var cell1 = newRow.insertCell(0);
//     cell1.innerHTML = name;

//     var cell2 = newRow.insertCell(1);
//     cell2.innerHTML = email;

//     var cell3 = newRow.insertCell(2);
//     cell3.innerHTML = phone;

//     var cell4 = newRow.insertCell(3);
//     cell4.innerHTML = service;

//     var cell5 = newRow.insertCell(4);
//     cell5.innerHTML = doctor;

//     var cell6 = newRow.insertCell(5);
//     cell6.innerHTML = date;

//     var cell7 = newRow.insertCell(6);
//     cell7.innerHTML = time;

//     // Reset formulir setelah data ditambahkan
//     document.getElementById('reservation-form').reset();
// }



  // ---------------------------------------------------------------------------------------- //

  const API_BASE_URL = 'https://railway-booking-production.up.railway.app';

  async function fetchBooking() {
    try {
        const response = await fetch(`${API_BASE_URL}/booking`);
        // const data = await response.json();
        // const booking = 
    } catch (error) {
        console.error(error);
    }
  }