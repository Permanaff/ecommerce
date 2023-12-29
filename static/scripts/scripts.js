$(document).ready(function () {
    
    profile_data();

    $('#collapse-akun-saya').click(function (event) {
        $('#collapseNotif').collapse('hide');
    });
    $('#collapse-notifikasi').click(function (event) {
        $('#collapseProfil').collapse('hide');
    });

    $('#btn-detail-profil').click(function (event) {
        event.preventDefault();
        $('#card-detail-profile').empty();
        profile_data();     
    });
    $('#btn-detail-alamat').click(function (event) {
        event.preventDefault();
        $('#card-detail-profile').empty();
        
        profile_data_alamat ();    
    });

});

function profile_data () { 
    $('#collapseProfil').collapse('show');

    $.ajax({
        url: '/profile',
        type: 'POST',
        success: function (response) {
            var detail_profil = $('#card-detail-profile');
            var users = response.users[0] ;


            var productHtml = `
            <h3 class="fs-5 fw-bold" id="teks-profil">Profil Saya</h3>
            <p  style="font-size: 14px;">Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
            <hr class="my-4">
            
            <div class="container ms-3">
                <div class="row">
                    <div class="col-8">
                        <div class="row">
                            <div class="col-2">
                                <label class="fs-6 ms-2" for="username" style="color: #777795; font-size: 5px;">Username</label>
                            </div>
                            <div class="col-5">
                                <p class="ms-2">${users.username}</p>
                            </div>
                        </div>
                    
                        <form class="ms-2" action="#" method="GET">
                            <div class="form-group mt-3" id="nama">
                                <div class="row">
                                    <div class="col-2">
                                        <label class="fs-6" for="name" style="color: #777795;">Nama</label>
                                    </div>
                                    <div class="col-md-10">
                                        <input  class="form-control rounded-0" type="text" name="name" id="name" value="${users.nama}" >
                                    </div>
                                </div>
                            </div>
                    
                            <div class="form-group mt-4">
                                <div class="row">
                                    <div class="col-2">
                                        <label for="name" style="color: #777795;">Email</label>
                                    </div>
                                    <div class="col-5">
                                        <p class="">${users.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group mt-4">
                                <div class="row">
                                    <div class="col-2">
                                        <label for="name" style="color: #777795;">Nomor Telpon</label>
                                    </div>
                                    <div class="col-5">
                                        <p class="">${users.no_telp}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group mt-4">
                                <div class="row">
                                    <div class="col-2">
                                        <label for="name" style="color: #777795;">Tanggal Lahir</label>
                                    </div>
                                    <div class="col-md-4 d-flex">
                                        <select class="form-select rounded-0" id="day" name="day" style="width: 125px;"></select>
                                        <select class="form-select rounded-0 ms-2" id="month" style="width: 125px;"></select>
                                        <select class="form-select rounded-0 ms-2" id="year" style="width: 125px;"></select>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-2"></div>
                                    <div class="col-auto d-flex">
                                        <p id="validationMessage" class="text-danger" style="font-size: 14px;"></p>
                                    </div>
                                </div>
                            </div>
                    
                            <div class="form-group mt-3 mb-4" >
                                <div class="row">
                                    <div class="col"></div>
                                    <div class="col-sm-10">
                                        <button type="submit" class="btn btn-primary">Simpan</button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>

                    <div class="col-1">
                        <div class="vertical-line-2 "></div>
                    </div>

                    <div class="col-auto text-center">
                        <img src="/static/images/product/81cfe5c9-955b-440a-a263-5ef284841335.jpg" class="rounded-circle border border-primary" alt="Deskripsi gambar" style="width: 120px">

                        <div class="mt-5">
                            <input type="file" class="form-control visually-hidden" id="imageUpload" name="image">
                            <button type="button" class="btn btn-sm btn-primary" onclick="document.getElementById('imageUpload').click()">Pilih Gambar</button>
                        </div>
                    </div>
                </div>

            </div>
            `;

            detail_profil.append(productHtml);

            var daySelect = $('#day');
            var monthSelect = $('#month');
            var yearSelect = $('#year');

            for (var i = 1; i <= 31; i++) {
                daySelect.append($('<option>', {
                    value: i,
                    text: i
                }));
            }

            var months = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];

            for (var i = 0; i < months.length; i++) {
                monthSelect.append($('<option>', {
                    value: i + 1,
                    text: months[i]
                }));
            }

            var currentYear = new Date().getFullYear();
            for (var i = currentYear; i >= currentYear-100; i--) {
                yearSelect.append($('<option>', {
                    value: i,
                    text: i
                }));
            }
            
            var birthDate = new Date(users.tanggalLahir);
            daySelect.val(birthDate.getDate());
            monthSelect.val(birthDate.getMonth() + 1); // Months are zero-based
            yearSelect.val(birthDate.getFullYear());

            $('#day, #month, #year').on('change', validateBirthdate);


            },
            error: function (error) {
                console.log(error);
        }
    });

    function validateBirthdate() {
        var daySelect = $('#day').val();
        var monthSelect = $('#month').val();
        var yearSelect = $('#year').val();

        var selectedDate = new Date(`${yearSelect}-${monthSelect}-${daySelect}`);
        var currentDate = new Date();

        var validationMessage = $('#validationMessage');

        if (selectedDate > currentDate) {
            validationMessage.text('Tanggal lahir tidak valid. Harap pilih tanggal lahir yang benar.');
        } else {
            validationMessage.text('');
        }
    }

}



function birthDateSelect() {
    document.addEventListener('DOMContentLoaded', function () {
        function generateOptions(start, end, selectedValue, elementId) {
            const dropdown = document.getElementById(elementId);
            if (!dropdown) {
                console.error(`Element dropdown dengan id '${elementId}' tidak ditemukan.`);
                return;
            }

            dropdown.innerHTML = ''; // Mengosongkan elemen dropdown sebelum menambahkan opsi

            for (let i = start; i <= end; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.text = i;
                option.selected = i === selectedValue;

                dropdown.add(option);
            }
        }

        function isValidDate(day, month, year) {
            const inputDate = new Date(`${year}-${month}-${day}`);
            const currentDate = new Date();

            return !isNaN(inputDate) && inputDate <= currentDate;
        }

        function validateDate() {
            const day = document.getElementById('day').value;
            const month = document.getElementById('month').value;
            const year = document.getElementById('year').value;

            const isValid = isValidDate(day, month, year);

            document.getElementById('validationMessage').innerText = isValid ? '' : 'Tanggal tidak valid';
        }

        generateOptions(1, 31, users.tanggalLahir.day, 'day');
        generateOptions(1, 12, users.tanggalLahir.month, 'month');
        generateOptions(currentYear, currentYear - 100, users.tanggalLahir.year, 'year');

        document.getElementById('day').addEventListener('change', validateDate);
        document.getElementById('month').addEventListener('change', validateDate);
        document.getElementById('year').addEventListener('change', validateDate);
    });
}


function profile_data_alamat() {
    $.ajax({
        url: '/alamat',
        type: 'GET',
        success: function (response) {
            var detail_profil = $('#card-detail-profile');

            let title = `
                <div class="row justify-content-between mb-4">
                    <div class="col-4">
                        <h3 class="fs-5 fw-bold" id="alamat-saya">Alamat Saya</h3>
                    </div>
                    <div class="col-4 d-flex justify-content-center">
                        <button class="btn btn-danger ms-5" data-bs-toggle="modal" data-bs-target="#modal-tmbh-alamat">
                            <span><i class="fa-solid fa-plus" style="color: #ffffff;"></i></span> Tambah Alamat
                        </button>
                    </div>
                </div>
            `;

            $.each(response.alamat, function (profile, alamat) {
                title += `
                    <hr class="my-2">
                    <div class="container">
                        <div class="row">
                            <div class="col-10">
                                <div class="row">
                                    <p class="fw-bold">
                                        ${alamat.nama_lengkap} 
                                        <span class="fw-light">| ${alamat.no_telp}</span>
                                    </p>
                                </div>
                                <div class="row">
                                    <p class="text-secondary" id="alamat-test">${alamat.jalan}, ${alamat.kecamatan}, ${alamat.kota}, ${alamat.provinsi}, ${alamat.kode_pos}</p>
                                </div>
                            </div>
                            <div class="col-2 d-flex align-items-center justify-content-between text-end">
                                <a class="ms-auto ms-5" href="#" style="font-size: 14px; color: #black;" id="ubahButton_${alamat.id_alamat}" onclick=showEditModal(${alamat.id_alamat})>Ubah</a>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            detail_profil.append(title);
    
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function showEditModal(alamatId) {
    $('#modal-edit-alamat').modal('show');
    getProvinsiEdit();

    $.ajax({
        url: '/alamat', 
        method: 'GET',
        success: function (response) {
            let dataAlamat = response.alamat.find(function(alamat) {
                return alamat.id_alamat == alamatId;
            });
            let nama = $('#edit-nama-alamat');
            let no_telp = $('#edit-no_telp-alamat');
            let provinsi = $('#edit-provinsi-alamat');
            let kota = $('#edit-kota-alamat');
            let detailAlamat = $('#edit-detail-alamat')
            let kodePos = $('#edit-kode-pos-alamat')

            
            nama.val(dataAlamat.nama_lengkap)
            no_telp.val(dataAlamat.no_telp)
            detailAlamat.val(dataAlamat.jalan)
            kodePos.val(dataAlamat.kode_pos)
            

            provinsi.val(dataAlamat.id_provinsi).change();
            getKotaEdit(dataAlamat.id_provinsi, dataAlamat.id_kota);
            getKecamatanEdit(dataAlamat.id_kota, dataAlamat.id_kecamatan)            

            provinsi.on('change', function () {
                getKotaEdit(this.value);
            });

            kota.on('change', function () {
                getKecamatanEdit(this.value);
            });
        },
        error: function (xhr, status, error) {
            console.error('Gagal mengambil data alamat:', error);
        }
    });

    function getProvinsiEdit() {
        fetch('/get_provinsi')
            .then(response => response.json())
            .then(data => {
                populateDropdownEdit('edit-provinsi-alamat', data, 'Pilih Provinsi');
            })
            .catch(error => console.error('Error:', error));
            
    }
    function getKotaEdit(selectedProvinsi, selectedKota) {
        if (!selectedProvinsi) {
            return;
        }
        fetch(`/get_kota/${selectedProvinsi}`)
            .then(response => response.json())
            .then(data => {
                populateDropdownEdit('edit-kota-alamat', data, 'Pilih Kota');
                if (selectedKota) {
                    document.getElementById('edit-kota-alamat').value = selectedKota;
                }
            })
            .catch(error => console.error('Error:', error));
    }
    function getKecamatanEdit(selectedKota, selectedKecamatan) {
        if (!selectedKota) {
            return;
        }
        fetch(`/get_kecamatan/${selectedKota}`)
            .then(response => response.json())
            .then(data => {
                populateDropdownEdit('edit-kecamatan-alamat', data, 'Pilih Kecamatan');
                if (selectedKecamatan) {
                    document.getElementById('edit-kecamatan-alamat').value = selectedKecamatan;
                }
            })
            .catch(error => console.error('Error:', error));
    }

    function populateDropdownEdit(dropdownId, data, defaultText) {
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = defaultText;
        dropdown.add(defaultOption);
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.text = item.name;
            dropdown.add(option);
        });
    }
    
    

}


// ====
const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const num = document.querySelector(".num");
const beliButton  = document.getElementById("#btn-beli");
const subtotalDisplay = document.querySelector(".subtotal-display");
const stokBarangElement = document.querySelector(".stok-barang");
const stokBarang = parseInt(stokBarangElement.dataset.stok);

let a = 1;

if (stokBarang < 1) {
    $(document).ready(function () {
        beliButton.setAttribute("disabled", true);
    });
};

plus.addEventListener("click", () => {
  if (a < stokBarang) {
    a++;
    num.innerText = a;
    updateSubtotal();
    updateButtonState();
  }
});

minus.addEventListener("click", () => {
  if (a > 1) {
    a--;
    num.innerText = a;
    updateSubtotal();
    updateButtonState();
  }
});

function updateSubtotal() {
  const productPriceStr = subtotalDisplay.dataset.productPrice.replace(/,/g, '');
  const productPrice = parseFloat(productPriceStr);

  if (!isNaN(productPrice)) {
    const totalPrice = a * productPrice;

    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    });

    subtotalDisplay.innerText = formatter.format(totalPrice);
  } else {
    subtotalDisplay.innerText = "Invalid Price";
  }
}

function updateButtonState() {
    if (a === 1) {
      minus.setAttribute("disabled", true);
    } else {
      minus.removeAttribute("disabled");
    }
  
    if (a === stokBarang) {
      plus.setAttribute("disabled", true);
    } else {
      plus.removeAttribute("disabled");
    }

    if (stokBarang === 0) {
        beliButton.setAttribute("disabled", true);
    } else {
        beliButton.removeAttribute("disabled");
    }
  }
  

function contentCardProfil(){
    var contentCard = $('#profil-seller')

    var content = `
        <div class="card-body" id="">

            <h3 class="fs-5 fw-bold" id="teks-profil">Toko Saya</h3>
            <hr class="mb-1">
            <button class="btn py-1 rounded-0 btn-block" id="btn-detail-seller">Detail</button>
            <button class="btn py-1 rounded-0 btn-block" id="btn-waktu-buka">Waktu Buka</button>
            <hr class="mt-1">
            
            <div class="container ms-3">
                <div class="row" id="contentProfil"></div>
            <div>
        </div>

    `
    contentCard.append(content);
    contentProfilSeller()

    $(document).ready(function () {
        $('#btn-detail-seller').addClass('border-0').attr("disabled", true)

        $('#btn-detail-seller').click(function (event) {
            event.preventDefault();
            $('#contentProfil').empty();
            $('#btn-detail-seller').addClass('border-0').attr("disabled", true)
            $('#btn-waktu-buka').removeClass('border-0').removeAttr("disabled")   
            contentProfilSeller()
        });

        $('#btn-waktu-buka').click(function (event) {
            event.preventDefault();
            $('#contentProfil').empty();
            $('#btn-waktu-buka').addClass('border-0').attr("disabled", true)
            $('#btn-detail-seller').removeClass('border-0').removeAttr("disabled")
            contentWaktuBuka()
   
        });
    });
    
}
  
function contentProfilSeller() {
    $.ajax({
        url: '/getSeller',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            var contentCard = $('#contentProfil')
            var seller = data.sellerProfil[0]

            var content = `
            <div class="col-8" >
                <form class="ms-2" action="#" method="GET">
                    <div class="form-group mt-3" id="nama">
                        <div class="row">
                            <div class="col-2">
                                <label class="fs-6" for="name" style="color: #777795;">Nama Toko</label>
                            </div>
                            <div class="col-md-10">
                                <input  class="form-control rounded-0" type="text" name="name" id="name" value="${seller.name}" >
                            </div>
                        </div>
                    </div>

                    <div class="form-group mt-4">
                        <div class="row">
                            <div class="col-2">
                                <label for="name" style="color: #777795;">Nomor Telpon</label>
                            </div>
                            <div class="col-5">
                                <p class="">nomor telpon</p>
                            </div>
                        </div>
                    </div>

                    <div class="form-group mt-4">
                        <div class="row">
                            <div class="col-2">
                                <label for="name" style="color: #777795;">Jam Buka</label>
                            </div>
                            <div class="col-md-6 d-flex">
                                <select class="form-select rounded-0" id="time-open" style="width: 500px;"></select>
                                <select class="form-select rounded-0 ms-2" id="time-close" style="width: 500px;"></select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group mt-4">
                        <div class="row">
                            <div class="col-2">
                                <label for="name" style="color: #777795;">Hari Buka</label>
                            </div>
                            <div class="col-md-4 d-flex" id="select-hari-buka">
                                <!-- Select Hari Buka -->
                            </div>
                        </div>
                    </div>

                    <div class="form-group mt-3 mb-4" >
                        <div class="row">
                            <div class="col"></div>
                            <div class="col-sm-10">
                                <button type="submit" class="btn btn-primary">Simpan</button>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
            <div class="col-1">
                <div class="vertical-line-2 "></div>
            </div>
            <div class="col-auto text-center">
                <img src="/static/images/product/81cfe5c9-955b-440a-a263-5ef284841335.jpg" class="rounded-circle border border-primary" alt="Deskripsi gambar" style="width: 120px">

                <div class="mt-5">
                    <input type="file" class="form-control visually-hidden" id="imageUpload" name="image">
                    <button type="button" class="btn btn-sm btn-primary" onclick="document.getElementById('imageUpload').click()">Pilih Gambar</button>
                </div>
            </div>
            `

            contentCard.append(content)
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
        });
}


function contentWaktuBuka() {
    $.ajax({
        url: '/getSeller',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            var contentCard = $('#contentProfil')
            var seller = data.sellerProfil[0]

            var content = `
            <div class="col-8" >
                <form class="ms-2" action="#" method="GET">
                    <div class="form-group mt-4">
                        <div class="row">
                            <div class="col-2">
                                <label for="name" style="color: #777795;">Jam Buka</label>
                            </div>
                            <div class="col-md-6 d-flex">
                                <select class="form-select rounded-0" id="time-open" style="width: 500px;"></select>
                                <select class="form-select rounded-0 ms-2" id="time-close" style="width: 500px;"></select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group mt-4">
                        <div class="row">
                            <div class="col-2">
                                <label for="name" style="color: #777795;">Hari Buka</label>
                            </div>
                            <div class="col-md-4 d-flex" id="select-hari-buka">
                                <!-- Select Hari Buka -->
                            </div>
                        </div>
                    </div>

                    <div class="form-group mt-3 mb-4" >
                        <div class="row">
                            <div class="col"></div>
                            <div class="col-sm-10">
                                <button type="submit" class="btn btn-primary">Simpan</button>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
            `

            contentCard.append(content)


            var hariBuka = $('#select-hari-buka');
            var hari = ['Senin', 'Selasa', 'Rabu', "Kamis", 'Jumat', 'Sabtu', 'Minggu'];
        
            var content = '';
        
            $.each(hari, function(index, value) {
                content += `
                    <input type="checkbox" class="btn-check" id="btn-check-${index+1}" autocomplete="off">
                    <label class="btn ms-1" for="btn-check-${index+1}">${value}</label>
                `
        
            });
        
            hariBuka.append(content)
           
        },
        error: function(error) {
            console.error('Error fetching data:', error);
        }
        });
}