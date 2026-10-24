# 🔐 Customer Portal Login Credentials

## 📋 All Customer Accounts

### 🏥 **Major Hospitals**

#### 1. Islamabad Medical Complex
- **Username:** `ProMed-IMC-Islamabad`
- **Password:** `IMC@2024!Secure`
- **Facility:** Islamabad Medical Complex
- **Location:** Islamabad

#### 2. Aga Khan University Hospital
- **Username:** `ProMed-AKUH-Karachi`
- **Password:** `AKUH@2024!Premium`
- **Facility:** Aga Khan University Hospital
- **Location:** Karachi

#### 3. Chughtai Healthcare
- **Username:** `ProMed-Chughtai-Labs`
- **Password:** `Chughtai@2024!Elite`
- **Facility:** Chughtai Healthcare
- **Location:** Multiple Locations

#### 4. Dr Akbar Niazi Teaching Hospital
- **Username:** `ProMed-ANTH-Islamabad`
- **Password:** `ANTH@2024!Medical`
- **Facility:** Dr Akbar Niazi Teaching Hospital
- **Location:** Islamabad

#### 5. Maroof International Hospital
- **Username:** `ProMed-Maroof-Islamabad`
- **Password:** `Maroof@2024!Care`
- **Facility:** Maroof International Hospital
- **Location:** Islamabad

#### 6. Rawalpindi Medical Institute (RMI)
- **Username:** `ProMed-RMI-Rawalpindi`
- **Password:** `RMI@2024!Institute`
- **Facility:** Rawalpindi Medical Institute
- **Location:** Rawalpindi

---

### 🎖️ **Military & Government Facilities**

#### 7. Pakistan Air Force Hospital
- **Username:** `ProMed-PAF-Medical`
- **Password:** `PAF@2024!Defense`
- **Facility:** Pakistan Air Force Hospital
- **Location:** Multiple PAF Bases

#### 8. Combined Military Hospital (Pakistan Army)
- **Username:** `ProMed-Army-CMH`
- **Password:** `Army@2024!Forces`
- **Facility:** Combined Military Hospital
- **Location:** Multiple Garrisons

#### 9. Rawal General Hospital
- **Username:** `ProMed-Rawal-Hospital`
- **Password:** `Rawal@2024!General`
- **Facility:** Rawal General Hospital
- **Location:** Islamabad

---

### 👨‍💼 **Admin Account**

#### 10. ProMED Admin (Emad Jadoon)
- **Username:** `ProMed-Admin-EmadJ`
- **Password:** `Admin@ProMED2024!`
- **Facility:** ProMED Solutions HQ
- **Role:** Administrator (Full Access)
- **Can:** View all facility data, export reports, manage system

---

## 🌐 Portal Access

**Login URL:** https://promedsol.com.pk/portal/login.html

**Local Testing:** `c:\Users\Ali\Desktop\Promedsol\portal\login.html`

---

## 🔥 Firebase Integration

**Project:** `promed-portal`  
**Database:** Firestore  
**Collection:** `mri_logs`

### Data Structure:
```json
{
  "facility": "Hospital Name",
  "heliumLevel": 67,
  "heliumPressure": 67,
  "humidity": 54,
  "machineId": "MRI-001",
  "machineModel": "TOSHIBA",
  "magnetTemp": 54,
  "nextService": "2026-10-20",
  "notes": "System normal",
  "status": "Normal",
  "submittedBy": "ProMed-IMC-Islamabad",
  "timestamp": "2026-10-20T15:14:50Z"
}
```

---

## 📊 Features

### **For Regular Users:**
- Submit MRI readings
- View last 10 readings
- Track helium levels & system status
- Auto status calculation (Normal/Warning/Critical)

### **For Admin:**
- View ALL facility readings
- Statistics dashboard
- Filter by facility
- Export to CSV
- Real-time monitoring

---

## 🔒 Security Notes

- All credentials follow ProMed naming convention
- Passwords include special characters, numbers, uppercase
- Each hospital has unique username with location identifier
- Admin account has elevated privileges
- Data stored securely in Firebase Firestore
- Session-based authentication

---

**Created:** October 2026  
**Last Updated:** October 2026  
**Maintained By:** ProMED Solutions IT Team
