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
  const API_BASE_URL = 'https://be-balikpapan-29-production.up.railway.app';

  const bookedTimes = {}; // Objek untuk melacak waktu yang sudah terpakai di hari yang sama
  
  // Mendapatkan referensi ke elemen-elemen HTML
  const reservationForm = document.getElementById('reservation-form');
  const resultTable = document.querySelector('tbody');
  
  // Menghubungkan fungsi submitForm dengan penyerahan formulir
  reservationForm.addEventListener('submit', submitForm);
  
  // Mengambil data reservasi saat halaman dimuat
  window.addEventListener('DOMContentLoaded', fetchData);
  
  // Fungsi untuk menampilkan notifikasi
  function showNotification(title, message) {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const notification = new Notification(title, {
            body: message,
            icon: "path/to/icon.png" // Ganti dengan URL ikon Anda
          });
  
          // Bisa menambahkan event click untuk menangani tindakan lebih lanjut
          notification.onclick = function () {
            // Lakukan tindakan setelah notifikasi diklik (jika diperlukan)
          };
        } else {
          // Notifikasi ditolak
          // Anda dapat menampilkan pesan alternatif jika notifikasi tidak diizinkan
          alert(message);
        }
      });
    } else {
      // Browser tidak mendukung notifikasi, tampilkan pesan alternatif
      alert(message);
    }
  }
  
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
      reservationdate: new Date(formData.get('date')).toISOString(),
      reservationtime: formData.get('time')
    };
  
    const selectedDate = bookingData.reservationdate;
    const selectedTime = bookingData.reservationtime;
  
    // Memeriksa apakah kombinasi service, dokter, tanggal, dan waktu sudah ada dalam reservasi yang ada
    const isDuplicateBooking = await isBookingDuplicate(bookingData);
    if (isDuplicateBooking) {
      alert('Reservasi dengan kombinasi yang sama sudah ada. Silakan pilih kombinasi yang lain.');
      return;
    }
  
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
        // Tandai waktu yang sudah terpakai
        if (!bookedTimes[selectedDate]) {
          bookedTimes[selectedDate] = [];
        }
        bookedTimes[selectedDate].push(selectedTime);
  
        // Tampilkan notifikasi berhasil
        showNotification('Reservasi berhasil!', 'Terima kasih telah melakukan reservasi.');
      } else {
        console.error('Gagal membuat reservasi');
        // Tampilkan notifikasi gagal
        showNotification('Gagal membuat reservasi', 'Mohon coba lagi nanti.');
      }
    } catch (error) {
      console.error(error);
      // Tampilkan notifikasi gagal
      showNotification('Gagal membuat reservasi', 'Terjadi kesalahan. Mohon coba lagi nanti.');
    }
  }
  
  // Mendefinisikan fungsi untuk menampilkan data reservasi ke dalam tabel
  function displayBooking(booking) {
    const row = document.createElement('tr');
  
    // Memeriksa apakah properti reservationdate ada dalam objek booking
    if (booking.reservationdate) {
      // Mengambil tanggal dari booking.reservationdate (format: yyyy-mm-dd)
      const reservationDate = booking.reservationdate.substring(0, 10); // Ambil tanggalnya saja
      const dateParts = reservationDate.split('-');
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Format ulang menjadi dd-mm-yyyy
  
      row.innerHTML = `
        <td>${booking.name}</td>
        <td>${booking.email}</td>
        <td>${booking.phone}</td>
        <td>${booking.service}</td>
        <td>${booking.doctor}</td>
        <td>${formattedDate}</td>
        <td>${booking.reservationtime}</td>
      `;
    } else {
      // Jika properti reservationdate tidak ada, set tampilan kolom reservationdate menjadi kosong
      row.innerHTML = `
        <td>${booking.name}</td>
        <td>${booking.email}</td>
        <td>${booking.phone}</td>
        <td>${booking.service}</td>
        <td>${booking.doctor}</td>
        <td></td>
        <td>${booking.reservationtime}</td>
      `;
    }
  
    resultTable.appendChild(row);
  
    // Setelah menampilkan data, kosongkan formulir untuk reservasi berikutnya jika perlu
    // reservationForm.reset();
  }
  
  // Mendefinisikan fungsi untuk mengambil data reservasi dari API
  async function fetchData() {
    try {
      const response = await fetch(`${API_BASE_URL}/booking`);
      if (response.ok) {
        const bookings = await response.json();
        bookings.forEach((booking) => {
          displayBooking(booking);
          // Tambahkan waktu yang sudah terpakai ke bookedTimes
          const reservationDate = booking.reservationdate.substring(0, 10); // Ambil tanggalnya saja
          const selectedTime = booking.reservationtime;
          if (!bookedTimes[reservationDate]) {
            bookedTimes[reservationDate] = [];
          }
          bookedTimes[reservationDate].push(selectedTime);
        });
      } else {
        console.error('Gagal mengambil data reservasi');
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  // Fungsi untuk memeriksa apakah kombinasi reservasi sudah ada
  async function isBookingDuplicate(newBooking) {
    try {
      const response = await fetch(`${API_BASE_URL}/booking`);
      if (response.ok) {
        const bookings = await response.json();
        for (const booking of bookings) {
          if (
            newBooking.service === booking.service &&
            newBooking.doctor === booking.doctor &&
            newBooking.reservationdate === booking.reservationdate &&
            newBooking.reservationtime === booking.reservationtime
          ) {
            return true; // Jika ada kombinasi yang sama, kembalikan true
          }
        }
      } else {
        console.error('Gagal mengambil data reservasi');
      }
    } catch (error) {
      console.error(error);
    }
    return false; // Jika tidak ada kombinasi yang sama, kembalikan false
  }
  