from flask import Flask, render_template, session, request , redirect, url_for, flash, jsonify
from flask_mysqldb import MySQL
import os
import requests

app = Flask(__name__)

app.secret_key = '!@#$%'

app.config['MYSQL_HOST'] = 'localhost'
app.config["MYSQL_USER"] = 'root'
app.config["MYSQL_PASSWORD"]= ''
app.config["MYSQL_DB"] = 'ecommerce'

mysql = MySQL(app)
 
# -=-=-=-=-=-=-=-=- HOME -=-=-=-=-=-=-=-=-
@app.route('/')
def home():

    cur = mysql.connection.cursor()
    cur.execute("SELECT id, name, description, price, image, views FROM products")
    data = cur.fetchall()
    cur.close() 
    
    # Produk Populer 
    most_product = sorted(data, key=lambda x: x[5], reverse=True)[:6]

    most_product = [{'id': row[0], 'name': row[1], 'description': row[2], 'price': row[3], 'image': row[4]} for row in most_product]
    products = [{'id': row[0], 'name': row[1], 'description': row[2], 'price': row[3], 'image': row[4]} for row in data]

    if 'is_logged_in' in session : 
        return render_template('home.html', products=products, name=session['username'], level_user=session['level_user'], populer=most_product, sessionStatus = session['status'])

    else:
        session['status'] = 0 
        return render_template('home.html', products=products, populer=most_product, sessionStatus = session['status'])
    

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST' and 'inpEmail' in request.form and 'inpPass' in request.form:
        email = request.form['inpEmail']
        passwd = request.form['inpPass']

        cur = mysql.connection.cursor()
        cur.execute(" SELECT * FROM users WHERE users.email = %s AND users.password = %s;", (email, passwd))
        result = cur.fetchone()
        
        cur.close()

        if result:
            session['is_logged_in'] = True
            session['user_id'] = result[0]
            session['nama'] = result[1] + ' ' + result[2] 
            session['username'] = result[3]
            session['email'] = result[5]
            session['no_telp'] = result[6]
            session['tanggalLahir'] = result[7]
            session['level_user'] = result[8]
            session['status'] = 1
            return redirect(url_for('home'))
        else:
            error_message = "Login Gagal. Email atau password tidak valid."
            flash(error_message, 'error')
            return redirect(url_for('login', error='Login Gagal'))
    else:
        return render_template('login.html')



@app.route('/logout', methods=['GET', 'POST'])
def logout(): 
    session.pop('is_logged_in', None)
    session.pop('user_id', None)
    session.pop('username', None)
    session.pop('level_user', None)
    session['status'] = None
    return redirect(url_for('home'))


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST" and "inpUser" in request.form and "inpEmail" in request.form and "inpPass" in request.form:
        username = request.form["inpUser"]
        email = request.form["inpEmail"]
        passwd = request.form["inpPass"]

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, passwd))
        mysql.connection.commit()

        session['is_logged_in'] = True
        session['username'] = email  

        return redirect(url_for('home'))
    else:
        return render_template('register.html')
    

# -=-=-=-=-=-=-=-=- Profile -=-=-=-=-=-=-=-=-
def sensor_email(email):
    if '@' in email:
        username, domain = email.split('@')
        censored_username = username[:2] + '*' * (len(username) - 2)
        censored_email = f"{censored_username}@{domain}"
        return censored_email
    else:
        print('Format email tidak valid')

def sensor_noTelp(no_telp):
    censored_noTelp =  '*' * (len(no_telp) - 2) + no_telp[-2:]
    return censored_noTelp
  

@app.route('/profile', methods=['GET', 'POST'])
def get_profile():
    users = []
    if 'is_logged_in' in session : 
        users.append({
            'user_id' : session['user_id'],
            'nama' : session['nama'],
            'username' : session['username'],
            'email' : sensor_email(session['email']),
            'level_user' : session['level_user'],
            'tanggalLahir' : session['tanggalLahir'],
            'no_telp' : sensor_noTelp(session['no_telp'])
        })

    return jsonify({'users' : users})
    
@app.route('/account')
def profile():
    return render_template('profile_new.html',sessionStatus = session['status'], name=session['username'], level_user=session['level_user'])



def secure_filename_custom(filename):
    allowed_characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_."

    cleaned_filename = ''.join(c if c in allowed_characters else '_' for c in filename)
    return cleaned_filename


# -=-=-=-=-=-=-=-=- Dashboard -=-=-=-=-=-=-=-=-

@app.route('/dashboard', methods=["GET", "POST"])
def dashboard():
        user_id = session['user_id']

        cur = mysql.connection.cursor()
        cur.execute("""
            SELECT nama FROM sellers WHERE user_id=%s
        """, (user_id,))
        
        data = cur.fetchall()
        cur.close() 
        name = session['username']

        seller_name = data[0][0]
        
        return render_template('dashboard.html', admin=True, name=name, level_user=session['level_user'], sessionStatus = session['status'], seller_name = seller_name)



@app.route('/add_product', methods=['POST', 'GET'])
def add_product():
    if request.method == 'POST':
        try:
            cur = mysql.connection.cursor()
            cur.execute("SELECT id FROM sellers WHERE user_id=%s", (session['user_id'], ))
            data = cur.fetchone()
            seller_id = data[0]

            name = request.form['name']
            description = request.form['description']
            price = request.form['price']
            stock = request.form['stock']

            image = request.files.get('image')
            if image:
                save_image = os.path.join("static\images\product", secure_filename_custom(image.filename))
                filename = secure_filename_custom(image.filename)
                image.save(save_image)

                cur.execute("INSERT INTO products (name, image, description, price, stok, seller_id) VALUES (%s, %s, %s, %s, %s, %s)",
                            (name, filename, description, price, stock, seller_id))
                mysql.connection.commit()
                cur.close()

                response = {'status': 'success', 'message': 'Produk berhasil ditambahkan'}
                return jsonify(response), 200
            else:
                response = {'status': 'error', 'message': 'Berkas tidak ditemukan'}
                return jsonify(response), 400

        except Exception as e:
            # Gagal
            response = {'status': 'error', 'message': str(e)}
            return jsonify(response), 500

    return render_template('dashboard.html')



@app.route('/edit_product/<int:id>', methods=['GET', 'POST'])
def edit_product(id):
    if request.method == 'POST':
        cur = mysql.connection.cursor()
        cur.execute("SELECT image FROM products WHERE id=%s", (id,))
        product = cur.fetchone()
        cur.close()

        name = request.form['name']
        description = request.form['description']
        price = request.form['price']
        image = request.files['image']
        stok = request.form['stock']

        if 'image' in request.files:
            image = request.files['image']

            if image.filename != '':
                save_image = os.path.join("static\images", secure_filename_custom(image.filename))
                filename = image.filename
                image.save(save_image)
            else:
                filename = product[0]
        else:
            filename = product['image']

        cur = mysql.connection.cursor()
        cur.execute("UPDATE products SET name=%s, description=%s, price=%s, image=%s, stok=%s WHERE id=%s",
                    (name, description, price, filename, stok, id))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Berhasil Mengupdate Produk!'})


@app.route('/delete_product/<int:id>', methods=['GET', 'POST'])
def delete_product(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM products WHERE id = %s", (id,))
    mysql.connection.commit()
    cur.close()

    flash('Produk berhasil dihapus', 'success')
    return redirect(url_for('dashboard'))


def get_products():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM products")
    products = cur.fetchall()
    cur.close()
    return products


@app.route('/products')
def display_products():
    products = get_products()
    return render_template('home.html', products=products)

@app.route('/simpanWaktuBuka', methods=['GET', 'POST'])
def saveWaktuBuka():
    if request.method == 'POST':
        user_id = session['user_id']
        jam_buka = request.form.get('time-open')
        jam_tutup = request.form.get('time-close')
        hari_buka = request.form.getlist('day_open')

        hari_buka_json = jsonify(hari_buka).get_data(as_text=True)

        print(jam_buka)
        print(jam_tutup)
        print(hari_buka)
        print(hari_buka_json)
        
        # Simpan data ke database
        cur = mysql.connection.cursor()
        cur.execute('UPDATE sellers SET jam_buka=%s, jam_tutup=%s, hari_buka=%s Where user_id=%s',
                    (jam_buka, jam_tutup, hari_buka_json, user_id,))
        mysql.connection.commit()
        cur.close()

        return redirect(url_for('dashboard'))


def getProvKotaKec(id, tipe):
    cur = mysql.connection.cursor()
    if tipe == 'provinsi' :
        cur.execute('SELECT name FROM provinsi WHERE id=%s', (id,))
        name = cur.fetchone()
    elif tipe == 'kota' :
        cur.execute('SELECT name FROM kota WHERE id=%s', (id,))
        name = cur.fetchone()
    elif tipe == 'kecamatan' :
        cur.execute('SELECT name FROM kecamatan WHERE id=%s', (id,))
        name = cur.fetchone()
    cur.close()
    return name[0]




# ----- JSON DASHBOARD -----
@app.route('/beranda', methods=['GET', 'POST'])
def get_statistik():
    user_id = session['user_id']

    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT
            SUM(stok) AS total_stok
        FROM
            products
        WHERE
            seller_id = (
                SELECT id
                FROM sellers
                WHERE user_id = %s
            )
    """, (user_id,))

    data = cur.fetchall()
    cur.execute("SELECT id, name, description, price, image, stok views FROM products WHERE stok <= 5 AND seller_id = ( SELECT id FROM sellers WHERE user_id = %s)", (user_id,))
    product = cur.fetchall()
    cur.close() 
    name = session['username']

    statistik = [{'stock' : row[0]} 
        for row in data]

    products = [{'id': row[0], 'name': row[1], 'description': row[2], 'price': row[3], 'image': row[4], 'stok':row[5]} for row in product]


    return jsonify({'statistik' : statistik},{'product' : products})


@app.route('/myproducts', methods=["GET", "POST"])
def get_my_product():
    user_id = session['user_id']

    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT products.id, products.name, products.description, products.price, products.stok, products.image, products.views
        FROM products
        JOIN sellers ON products.seller_id = sellers.id
        WHERE sellers.user_id = %s
    """, (user_id,))
    
    data = cur.fetchall()
    cur.close() 

    products = [{'id': row[0], 'name': row[1], 'description': row[2], 'price': row[3], 'stok': row[4], 'image': row[5], 'views':[6]} for row in data]

    return jsonify({'products' : products})


@app.route('/getSeller', methods=["GET","POST"])
def getSeller():
    user_id = session['user_id']
    
    cur= mysql.connection.cursor()
    cur.execute("SELECT * FROM sellers WHERE user_id=%s", (user_id,))
    data = cur.fetchall()
    cur.close()

    seller = [{
        'id' : row[0], 
        'name':row[2], 
        'alamat_lengkap':row[3], 
        'provinsi': getProvKotaKec(row[4], 'provinsi'), 
        'kota': getProvKotaKec(row[5], 'kota'), 
        'kecamatan': getProvKotaKec(row[6], 'kecamatan'),
        "tipeSeller": row[7], 
        "profileImage":row[8],
        'jamBuka' : str(row[9]),
        'jamTutup' : str(row[10])[:5],
        'waktu_buka': row[11]
        } for row in data]
    print(seller)
    return jsonify({'sellerProfil' : seller})


# -=-=-=-=-=-=-=- END DASHBOARD -=-=-=-=-=-=-=-


# ============================================================ Detail Produk ===========================================================

@app.route('/product_detail/<int:id>/name')
def product_detail(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, name, description, price, image, stok, seller_id  FROM products WHERE id = %s", (id,))
    data = cur.fetchall()

    cur.execute("SELECT sellers.nama, sellers.profile_image FROM products JOIN sellers ON products.seller_id = sellers.id WHERE products.id = %s", (id,))
    seller = cur.fetchone()
    name = session['username']

    cur.close() 
    viewProduct(id)

    products = [{'id': row[0], 'name': row[1], 'description': row[2], 'price': row[3], 'image': row[4], 'stok': row[5]} for row in data]


    return render_template('detail.html', products=products, tokoName=seller[0], profileImage=seller[1], name=name, level_user=session['level_user'], sessionStatus = session['status'] )


def viewProduct(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT views FROM products WHERE id = %s", (id,))
    views = cur.fetchone()
    views = views[0]
    views +=1
    cur.execute("UPDATE products SET views=%s WHERE id=%s",
            (views, id,))
    mysql.connection.commit()


@app.route('/get_product_detail/<int:id>')
def get_product_detail(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM products WHERE id = %s", (id,))
    data = cur.fetchone()
    cur.close()

    products = [{'id': row[0], 'name': row[1], 'description': row[2], 'price': row[3], 'image': row[4], 'stok': row[5]} for row in data]

    return jsonify({'products' : products})



# ============================================================ END DETAIL PRODUCT ============================================================

@app.route('/addProduct')
def addProduct():
    return render_template("add_product.html",  sessionStatus = session['status'], name=session['username'])


@app.route('/editProduct/<int:id>/name')
def editProduct(id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, name, description, price, image, stok FROM products WHERE id = %s", (id,))
    data = cur.fetchall()
    cur.close() 
    
    products = [{'id': row[0], 'name': row[1], 'description': row[2], 'price': row[3], 'image': row[4], 'stok': row[5]} for row in data]

    return render_template("edit_product.html", products=products, sessionStatus = session['status'], name=session['username'])


 
 
# -=-=-=-=-=-=-=-=- ADD ALAMAT PROFILE -=-=-=-=-=-=-=-=-

@app.route('/simpanAlamat', methods=['POST'])
def simpanAlamat():
    nama_lengkap = request.form['inpNama']
    user_id = session['user_id']
    no_telp = request.form['inpTelp']
    jalan = request.form['inpAlamat']
    kota = request.form['inpKota']
    kecamatan = request.form['inpKec']
    provinsi = request.form['inpProvinsi']
    kode_pos = request.form['inpKode_pos']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO alamat_user (nama_lengkap, user_id, no_telp, jalan, kota, kecamatan, provinsi, kode_pos) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (nama_lengkap, user_id, no_telp, jalan, kota, kecamatan, provinsi, kode_pos,))
    mysql.connection.commit()

    return redirect(url_for('profile'))


@app.route('/alamat', methods=['GET', 'POST'])
def get_alamat():
    cur = mysql.connection.cursor()
    cur.execute("""SELECT alamat_user.*, 
       provinsi.name, 
       kota.name, 
       kecamatan.name
        FROM alamat_user
        JOIN provinsi ON alamat_user.provinsi = provinsi.id
        JOIN kota ON alamat_user.kota = kota.id
        JOIN kecamatan ON alamat_user.kecamatan = kecamatan.id
        WHERE alamat_user.user_id = %s
        """, (session['user_id'],))
    data = cur.fetchall()

    alamat = [{
        'id_alamat' : row[0], 
        'nama_lengkap' : row[1],
        'no_telp' : row[3],
        'jalan' : row[4],
        'id_kota' : row[5], 
        'id_kecamatan' : row[6], 
        'id_provinsi' : row[7],  
        'kota' : row[10], 
        'kecamatan' : row[11], 
        'provinsi' : row[9], 
        'kode_pos' : row[8]
        } 
        for row in data]

    return jsonify({'alamat' : alamat})




if __name__== "__main__":
    app.run(debug=True)

