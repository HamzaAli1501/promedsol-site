from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = 'promed-secret-key-2024-secure'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH  = os.path.join(BASE_DIR, 'database.db')

# ========== SINGLE AUTHORISED USER ==========
# Only this one account can ever log in â€” no registration allowed
SINGLE_USERNAME = 'ProMed-Solution'
SINGLE_PASSWORD = '123456789'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# ========== DATABASE SETUP ==========
def init_db():
    conn = get_db()
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            username      TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            facility_name TEXT NOT NULL,
            is_admin      INTEGER DEFAULT 0,
            created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # mri_logs â€” added humidity, removed quench_event
    c.execute('''
        CREATE TABLE IF NOT EXISTS mri_logs (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id      INTEGER NOT NULL,
            facility_name    TEXT NOT NULL,
            machine_id       TEXT NOT NULL,
            machine_model    TEXT,
            helium_pressure  REAL NOT NULL,
            helium_level     REAL NOT NULL,
            magnet_temp_k    REAL,
            humidity_pct     REAL,
            next_service     DATE,
            technician_notes TEXT,
            status           TEXT DEFAULT 'Normal',
            timestamp        DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES users(id)
        )
    ''')

    conn.commit()
    conn.close()

    # Seed the single authorised user
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute(
            'INSERT INTO users (username, password_hash, facility_name, is_admin) VALUES (?, ?, ?, ?)',
            (SINGLE_USERNAME, generate_password_hash(SINGLE_PASSWORD), 'ProMED Solutions', 1)
        )
        conn.commit()
        conn.close()
    except Exception:
        pass  # already exists

init_db()

# ========== USER MODEL ==========
class User(UserMixin):
    def __init__(self, id, username, facility_name, is_admin=False):
        self.id = id
        self.username = username
        self.facility_name = facility_name
        self.is_admin = bool(is_admin)

@login_manager.user_loader
def load_user(user_id):
    conn = get_db()
    row = conn.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
    conn.close()
    if row:
        return User(row['id'], row['username'], row['facility_name'], row['is_admin'])
    return None

# ========== AUTO STATUS ==========
def compute_status(helium_level, helium_pressure):
    if helium_level < 20 or helium_pressure < 0.8:
        return 'Critical'
    if helium_level < 50 or helium_pressure < 2.0:
        return 'Warning'
    return 'Normal'

# ========== ROUTES ==========

@app.route('/')
def home():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

# ---------- LOGIN (only route for auth â€” no register) ----------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        conn = get_db()
        row = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()

        if row and check_password_hash(row['password_hash'], password):
            user = User(row['id'], row['username'], row['facility_name'], row['is_admin'])
            login_user(user)
            return redirect(url_for('dashboard'))

        flash('Invalid username or password.', 'error')

    return render_template('login.html')

# ---------- DASHBOARD ----------
@app.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    if request.method == 'POST':
        try:
            machine_id      = request.form.get('machine_id', '').strip()
            machine_model   = request.form.get('machine_model', '').strip()
            helium_pressure = float(request.form.get('helium_pressure', 0))
            helium_level    = float(request.form.get('helium_level', 0))
            magnet_temp_k   = request.form.get('magnet_temp_k') or None
            humidity_pct    = request.form.get('humidity_pct') or None
            next_service    = request.form.get('next_service') or None
            notes           = request.form.get('technician_notes', '').strip()
            status          = compute_status(helium_level, helium_pressure)

            magnet_temp_k = float(magnet_temp_k) if magnet_temp_k else None
            humidity_pct  = float(humidity_pct)  if humidity_pct  else None

            conn = get_db()
            conn.execute('''
                INSERT INTO mri_logs
                  (customer_id, facility_name, machine_id, machine_model,
                   helium_pressure, helium_level, magnet_temp_k,
                   humidity_pct, next_service, technician_notes, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                current_user.id, current_user.facility_name,
                machine_id, machine_model,
                helium_pressure, helium_level,
                magnet_temp_k, humidity_pct,
                next_service, notes, status
            ))
            conn.commit()
            conn.close()
            flash('Reading saved successfully.', 'success')
            return redirect(url_for('dashboard'))

        except Exception as e:
            flash(f'Error saving data: {str(e)}', 'error')

    conn = get_db()
    history = conn.execute(
        'SELECT * FROM mri_logs WHERE customer_id = ? ORDER BY timestamp DESC LIMIT 20',
        (current_user.id,)
    ).fetchall()
    latest = history[0] if history else None
    conn.close()

    return render_template('dashboard.html',
                           facility_name=current_user.facility_name,
                           history=history,
                           latest=latest)

# ---------- ADMIN ----------
@app.route('/admin')
@login_required
def admin():
    if not current_user.is_admin:
        return redirect(url_for('dashboard'))

    conn = get_db()
    logs = conn.execute('SELECT * FROM mri_logs ORDER BY timestamp DESC').fetchall()
    conn.close()
    return render_template('admin.html', logs=logs)

# ---------- LOGOUT ----------
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

# ---------- API ----------
@app.route('/api/latest')
@login_required
def api_latest():
    conn = get_db()
    row = conn.execute(
        'SELECT helium_pressure, helium_level, humidity_pct, status, timestamp FROM mri_logs ORDER BY timestamp DESC LIMIT 1'
    ).fetchone()
    conn.close()
    if row:
        return jsonify(dict(row))
    return jsonify({'error': 'No data'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
