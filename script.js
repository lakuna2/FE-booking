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

  const API_BASE_URL = 'https://railway-booking-production.up.railway.app';

  // Mendapatkan referensi ke elemen-elemen HTML
  const reservationForm = document.getElementById('reservation-form');
  const resultTable = document.querySelector('tbody');
  
  // Mendefinisikan fungsi untuk mengirim data reservasi ke API
  async function submitForm(event) {
    event.preventDefault();
  
    const formData = new FormData(reservationForm);
  
    const bookingData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      doctor: formData.get('doctor'),
      reservationdate: formData.get('date'),
      reservationtime: formData.get('time')
    };
  
    try {
      const response = await fetch(`${API_BASE_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
  
      if (response.ok) {
        const createdBooking = await response.json();
        displayBooking(createdBooking);
      } else {
        console.error('Gagal membuat reservasi');
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  // Mendefinisikan fungsi untuk menampilkan data reservasi ke dalam tabel
  function displayBooking(booking) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${booking.name}</td>
      <td>${booking.email}</td>
      <td>${booking.phone}</td>
      <td>${booking.service}</td>
      <td>${booking.doctor}</td>
      <td>${booking.reservationdate}</td>
      <td>${booking.reservationtime}</td>
    `;
  
    resultTable.appendChild(row);
  
    // Setelah menampilkan data, kosongkan formulir untuk reservasi berikutnya jika perlu
    reservationForm.reset();
  }
  
  // Menghubungkan fungsi submitForm dengan penyerahan formulir
  reservationForm.addEventListener('submit', submitForm);
  