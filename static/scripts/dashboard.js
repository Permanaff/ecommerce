
$(document).ready(function () {
    
    profile_side()
    $('#btn-beranda').click(function (event) {
        $('#collapseProduk').collapse('hide');
    });


    $('#btn-beranda').click(function (event) {
        event.preventDefault();
        $('#content-dashboard').empty();
        beranda_dashboard();     
    });
    $('#btn-daftar-produk').click(function (event) {
        event.preventDefault();
        $('#content-dashboard').empty();
        daftar_product();     
    });
    
    $('#btn-tambah-produk').click(function (event) {
        event.preventDefault();
        $('#content-dashboard').empty();
        tambah_produk_page();     
    });


    $('#content-dashboard').on('click', '[id^="editButton_"]', function(event) {
        event.preventDefault();
        $('#content-dashboard').empty();
        var productId = $(this).attr('id').split('_')[1];
        ubah_produk(productId);
    });
    
    $('#btn-tokoAnda').click(function(event) {
        event.preventDefault();
        $('#content-dashboard').empty();
        contentCardProfil();
    });
    
});

function profile_side() {
    $.ajax({
        url: '/getSeller',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            let profil = $('#profil-side')
            let seller = data.sellerProfil[0]

            let content = `
                <div class="col-2">
                    <img src="/static/images/profil_seller/${seller.profileImage}" class="rounded-circle border border-secondary" alt="Deskripsi gambar" style="width: 45px">
                </div>
                <div class="col-auto ms-3">
                    <p class="text fw-bold mb-0 text-wrap" style="width: 120px;">${seller.name}</p>
                    <i class="fa-solid fa-pencil fa-2xs" style="color: #a3a3a3;">
                        <a class="fw-light" href="#detail-profil" style="color: #a3a3a3;">Ubah Profil</a>
                    </i>
                </div>
            `;

            profil.append(content)
            
            beranda_dashboard();

        }
    });

}



// AJAX beranda
function beranda_dashboard () { 
    $('#collapse-produk-saya').collapse('hide');
    $.ajax({
        url: '/beranda',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            let beranda = $('#content-dashboard');
            
            let stock = data[0]?.statistik[0];
            let products =  data[1];

            let content = `
                    <div class="container  mt-4">
                        <div class="row">

                            <div class="col">
                                <div class="card shadow-sm">
                                    <div class="card-body">
                                        <div class="d-flex flex-column justify-content-start">
                                            <div class="p-2">
                                                <i class="fa-solid fa-house fa-2xl"></i>
                                            </div>
                                            <div class="p-2">
                                                <p class="fw-semibold">Total Stok Produk</p>
                                            </div>
                                            <div class="p-2">
                                                <p class="fs-3 fw-bold">${stock.stock}</p>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        
                            <div class="col">
                                <div class="card shadow-sm">
                                    <div class="card-body">
                                        <div class="d-flex flex-column justify-content-start">
                                            <div class="p-2">
                                                <i class="fa-solid fa-indent fa-2xl"></i>
                                            </div>
                                            <div class="p-2">
                                                <p class="fw-bold">Jumlah Stok Masuk</p>
                                            </div>
                                            <div class="p-2">
                                                <p class="fs-3 fw-bold">${stock.stock}</p>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>

                            <div class="col">
                                <div class="card shadow-sm">
                                    <div class="card-body">
                                        <div class="d-flex flex-column justify-content-start">
                                            <div class="p-2">
                                                <i class="fa-solid fa-outdent fa-2xl"></i>
                                            </div>
                                            <div class="p-2">
                                                <p class="fw-bold">Jumlah Stok Keluar</p>
                                            </div>
                                            <div class="p-2">
                                                <p class="fs-3 fw-bold">0</p>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            
                        
                            <div class="col"> 
                                <div class="card shadow-sm">
                                    <div class="card-body">
                                        <div class="d-flex flex-column justify-content-start">
                                            <div class="p-2">
                                                <i class="fa-solid fa-list fa-2xl"></i>
                                            </div>
                                            <div class="p-2">
                                                <p class="fw-bold">Jumlah Transaksi</p>
                                            </div>
                                            <div class="p-2">
                                                <p class="fs-3 fw-bold">0</p>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            
                        </div>  
                    </div>  
                    <hr class="my-4">
                    <div class="container mt-5" id="beranda-bottom">
                        <div class="row">
                            <div class="col">
                                <hr class="my-2">
                                <p class="fs-6 fw-semibold">Produk Terlaris</p>
                                <hr class="my-2">
                            </div>

                            <div class="col" id="stok-sedikit">
                                <hr class="my-2">
                                <p class="fs-6 fw-semibold">Stok Sedikit</p>
                                <hr class="my-2">
                            </div>
                        </div>
                    </div>
            `;
            beranda.append(content);

            let stok_sedikit = $('#stok-sedikit');
            let content_bottom = ``;

            $.each(products.product, function (index, product) {
                content_bottom +=`
                
                        <div class="card shadow-sm mt-2">
                            <div class="card-body">
                                <div class="container d-flex flex-column align-items-start">
                                    <div class="row" >
                                        <div class="col-4">
                                            <div class="col-2">
                                            <img class="rounded-3" src="/static/images/product/${product.image}" alt="gambar-produk" width="75px">
                                            </div>
                                        </div>
                                        <div class="col-8 d-flex flex-column align-items-start">
                                            <p class="fw-semibold text-truncate mb-1" style="margin-bottom: 1px; width: 250px;">${product.name}</p>
                                            <p class="text-body-secondary" style="margin-bottom: 1px; font-size: 15px;">
                                                Stok:
                                                <span class="fw-semibold" style="color : red;">${product.stok}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                `;
            });
            
            stok_sedikit.append(content_bottom);

        },
    });
}



function daftar_product() {
    $.ajax({
        url: '/myproducts',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            let beranda = $('#content-dashboard');

            let formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });

            let daftarProduk = data.products.map(function (product) {
                let formattedPriceText = formattedPrice.format(product.price);

                return `
                    <div class="container mt-2">
                        <div class="card shadow-sm">
                            <div class="body">
                                <!-- content card -->
                                <div class="container">
                                    <div class="row">
                                        <!-- image dan nama-->
                                        <div class="col-sm-9 mt-4 mb-4">

                                            <div class="row">
                                                <div class="col-2">
                                                    <img class="rounded-3" src="/static/images/product/${product.image}" alt="gambar-produk" width="100px">
                                                </div>
                                                <div class="col-auto ">
                                                    <p class="fs-5 fw-semibold text-wrap" style="margin-bottom: 1px; width: 650px;">${product.name}</p>
                                                    <p class="text-body-secondary" style="margin-bottom: 1px; font-size: 15px;">
                                                        Stok:
                                                        <span class="fw-semibold ">${product.stok}</span>
                                                    </p>
                                                    <p class="text-body-secondary" style="margin-bottom: 1px; font-size: 15px;">
                                                        Terjual:
                                                        <span class="fw-semibold">500</span>
                                                    </p>
                                                    <p class="text-body-secondary" style="margin-bottom: 1px; font-size: 15px;">
                                                        views:
                                                        <span class="fw-semibold">${product.views}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                        <div class="col-sm-3 mt-3 mb-3">
                                            <div class="row">
                                                <!-- button -->
                                                <div class="col-4 col-sm-6 d-flex ">
                                                    <div class="d-flex flex-column">
                                                        <div class="row">
                                                            <div class="container">
                                                                <button type="button" class="btn btn-outline-info" id="editButton_${product.id}" style="width: 100%;">Edit</button>
                                                            </div>
                                                        </div>
                                                        <div class="row mt-2">
                                                            <form class="d-flex" method="POST" action=""> 
                                                                <button type="submit" class="btn btn-outline-danger" style="width: 100%;">Hapus</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                        
                                    </div>
                                </div>
                                <!-- end content card -->
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            var content = `
                <div class="container mt-4" id="daftar-products">
                    <h2>Produk Anda</h2>
                    <hr class="my-4 mt-2">
                    <div class="row">${daftarProduk}</div>
                </div>
            `;

            beranda.append(content);
        },
        error: function (error) {
            console.error('Error retrieving product data:', error);
        }
    });
}


function tambah_produk_page() {
    var beranda = $('#content-dashboard');

    var form = `
        <div class="container mt-5 col-md-7">
            <form id="addProductForm" method="post" enctype="multipart/form-data">
                <div class="form-group row mb-4">
                    <label for="inputNameProduct" class="col-sm-2 col-form-label">Nama Barang</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="productname" name="name" required>
                    </div>
                </div>

                <div class="form-group row mb-4">
                    <label for="inputDescriptionProduct" class="col-sm-2 col-form-label">Description</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" id="productDescription" name="description" rows="8" required></textarea>
                    </div>
                </div>

                <div class="form-group row mb-4">
                    <label for="inputPriceProduct" class="col-sm-2 col-form-label">Harga Barang</label>
                    <div class="col-sm-10">
                        <input type="number" class="form-control" id="productPrice" name="price" required>
                    </div>
                </div>

                <div class="form-group row mb-4">
                    <label for="inputStockProduct" class="col-sm-2 col-form-label">Stok Barang</label>
                    <div class="col-sm-10">
                        <input type="number" class="form-control" id="productStock" name="stock" required>
                    </div>
                </div>

                <div class="form-group row mb-4">
                    <label for="formFile" class="col-sm-2 col-form-label">Unggah Gambar</label>
                    <div class="col-sm-10">
                        <input class="form-control" type="file" id="image" name="image" >
                    </div>
                </div>

            
                <div class="form-group row mb-4">
                    <button type="submit" id="submitBtn" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        </div>
    `;

    beranda.append(form);

    $('#submitBtn').on('click', function(event) {
        event.preventDefault();

        var formData = new FormData($('#addProductForm')[0]);
        console.log(formData)

        $.ajax({
            url: '/add_product',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                $('#content-dashboard').prepend(`
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            ${response.message}
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    `);

                    $('#productname').val('');
                    $('#productDescription').val('');
                    $('#productPrice').val('');
                    $('#productStock').val('');
                    $('#image').val('');
            },
            error: function(error) {
                // console.log("Error:", error.responseText);
                $('#content-dashboard').prepend(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        ${error.responseText}
                        <button type="button" class="btn-close" data-bs-dismiss="danger" aria-label="Close"></button>
                    </div>
                    
                `);           
            }
        });
    });
}


// Ubah data produk 
function ubah_produk(productId) {
    $.ajax({
        url: '/myproducts', 
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var beranda = $('#content-dashboard');

            var productData = response.products.find(function(product) {
                return (product.id == productId);
            });


            let content = `
                <div class="container mt-4">
                    <div class="row">
                        <!-- Gambar Produk -->
                        <div class="col-md-4">
                            <img src="/static/images/product/${productData.image}" class="img-fluid rounded-start rounded-3" alt="{{ product['name'] }}" style="max-width: 540;">
                        </div>
                        <div class="col-md-8">
                            <div class="card">
                                <div class="card-body">
                                    <form id="formUpdateProduct" method="post" enctype="multipart/form-data">
                                        <div class="form-group row mb-4">
                                            <label for="inputNameProduct" class="col-sm-2 col-form-label">Nama Barang</label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" id="productname" name="name" value="${productData.name}" required>
                                            </div>
                                        </div>
                                
                                        <div class="form-group row mb-4">
                                            <label for="inputDescriptionProduct" class="col-sm-2 col-form-label">Description</label>
                                            <div class="col-sm-10">
                                                <textarea class="form-control" id="productDescription" name="description" rows="8" required>${productData.description}</textarea>
                                            </div>
                                        </div>
                                        
                                
                                        <div class="form-group row mb-4">
                                            <label for="inputPriceProduct" class="col-sm-2 col-form-label">Harga Barang</label>
                                            <div class="col-sm-10">
                                            <input type="number" class="form-control" id="productPrice" name="price" value="${productData.price}" required>
                                            </div>
                                        </div>
                                
                                        <div class="form-group row mb-4">
                                            <label for="inputStockProduct" class="col-sm-2 col-form-label">Stok Barang</label>
                                            <div class="col-sm-10">
                                            <input type="number" class="form-control" id="productStock" name="stock" value="${productData.stok}" required>
                                            </div>
                                        </div>
                                
                                        <div class="form-group row mb-4">
                                            <label for="formFile" class="col-sm-2 col-form-label">Unggah Gambar</label>
                                            <div class="col-sm-10">
                                                <input class="form-control" type="file" id="image" name="image" value="${productData.image}" >
                                            </div>
                                        </div>
                                        
                                        
                                        <div class="form-group row mb-4" >
                                            <button id="submitBtnEdit" type="submit" class="btn btn-primary">Simpan</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            beranda.append(content)
            
            $('#submitBtnEdit').on('click', function(event) {
                event.preventDefault();
        
                var formData = new FormData($('#formUpdateProduct')[0]);
                console.log(formData);
                $.ajax({
                    url: '/edit_product/'+productId,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        $('#content-dashboard').prepend(`
                                <div class="alert alert-success alert-dismissible fade show" role="alert">
                                    ${response.message}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            `);
                    },
                    error: function(error) {
                        // console.log("Error:", error.responseText);
                        $('#content-dashboard').prepend(`
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                ${error.responseText}
                                <button type="button" class="btn-close" data-bs-dismiss="danger" aria-label="Close"></button>
                            </div>
                            
                        `);           
                    }
                });
            });
                
        },
        error: function(error) {
            console.error('Error fetching product data:', error);
        }
    });
}

// =============== TOKO ANDA ===============
function contentCardProfil(){
    var contentCard = $('#content-dashboard')

    var content = `
        <div class="container mt-5">
            <div class="card shadow-sm border-1 rounded-0" id="profil-seller">
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
            </div>
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
                <form class="ms-2" id="formWaktuBuka" method="POST" enctype="multipart/form-data">
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
                                <label for="name" style="color: #777795;">Alamat</label>
                            </div>
                            <div class="col-10">
                                <p class="">${seller.alamat_lengkap}, ${seller.provinsi}, ${seller.kota}, ${seller.kecamatan}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group mt-4">
                        <div class="row">
                            <div class="col-2">
                                <label for="name" style="color: #777795;">Hari Buka</label>
                            </div>
                            <div class="col-10" id="daftrWaktuBuka"> 
                                <p class="text-secondary fs-6" id="hariBukaList"></p>
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
                <img src="/static/images/profil_seller/${seller.profileImage}" class="rounded-circle border border-secondary" alt="Deskripsi gambar" style="width: 120px">

                <div class="mt-5">
                    <input type="file" class="form-control visually-hidden" id="imageUpload" name="image">
                    <button type="button" class="btn btn-sm btn-primary" onclick="document.getElementById('imageUpload').click()">Pilih Gambar</button>
                </div>
            </div>
            `

            contentCard.append(content)

            var hariBukaList = document.getElementById('hariBukaList');

            var hariBukaArray = JSON.parse(seller.waktu_buka);
    
            var hariBukaHTML = '';
            var hariBukaHTML = '<ul class="list-unstyled">';
            hariBukaArray.forEach(function(hari) {
                hariBukaHTML += '<li class="mb-2">' + hari + ' ' + seller.jamBuka + '-' + seller.jamTutup + '</li>';
            });
            hariBukaHTML += '</ul>';
            hariBukaList.innerHTML = hariBukaHTML;


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
                <form class="ms-2" action="simpanWaktuBuka" method="POST" enctype="multipart/form-data">
                    <div class="form-group mt-4">
                        <div class="row">
                            <div class="col-2">
                                <label for="name" style="color: #777795;">Jam Buka</label>
                            </div>
                            <div class="col-md-6 d-flex">
                                <select class="form-select rounded-0" id="time-open" name="time-open" style="width: 500px;"></select>
                                <select class="form-select rounded-0 ms-2" id="time-close" name="time-close" style="width: 500px;"></select>
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
            

            var jamBuka = $("#time-open");
            var jamTutup = $("#time-close");
        
            for (var i = 0; i <= 23; i++) {
                var hour = (i < 10) ? '0' + i : i;
                jamBuka.append($('<option>',{
                    value: hour + ":00",
                    text : hour + ":00" 
                }));
            }
            
            for (var i = 0; i <= 23; i++) {
                var hour = (i < 10) ? '0' + i : i;
                jamTutup.append($('<option>',{
                    value: hour + ":00",
                    text : hour + ":00"
                }));
            }
   
            var hariBuka = $('#select-hari-buka');
            var hari = ['Senin', 'Selasa', 'Rabu', "Kamis", 'Jumat', 'Sabtu', 'Minggu'];
        
            var content = '';
        
            $.each(hari, function(index, value) {
                content += `
                    <input type="checkbox" name="day_open" class="btn-check" value="${value}" id="btn-check-${value}" autocomplete="off">
                    <label class="btn ms-1 "Sabtu""  for="btn-check-${value}">${value}</label>
                `
            });
            hariBuka.append(content)
        },
        error: function(error) {
            console.error('Error fetching data:', error);
  
        }
        });
}