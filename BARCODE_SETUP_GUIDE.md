# 🏷️ MeroPasal Barcode System Setup & Installation Guide

A complete hardware and software guide for setting up **Webcam Barcode Scanning**, **Handheld Scanner Guns**, and **Thermal Barcode Sticker Printers** in MeroPasal.

---

## 1. 📦 Hardware Options & How They Work

MeroPasal supports **two primary methods** for barcode handling:

| Method | Best For | Hardware Required | Setup Difficulty |
| :--- | :--- | :--- | :--- |
| **Webcam / Phone Camera** | Laptops, Tablets, Smartphones | Built-in webcam or USB camera | **Zero setup** (Plug & Play) |
| **Handheld Scanner Gun** | High-traffic retail counters | USB / 2.4GHz / Bluetooth 1D/2D Gun | **Plug & Play** (HID Keyboard) |
| **Thermal Sticker Printer** | Printing barcode tags for shelves | 58mm / 80mm Label Printer (Xprinter, TSC, etc.) | Standard printer driver |

---

## 2. 📷 Webcam & Mobile Camera Setup

The webcam scanner uses `@zxing/library` to detect barcodes in real-time.

### Step 1: Allow Camera Permissions
1. Open MeroPasal in Google Chrome, Safari, or Edge.
2. Go to **POS Terminal** or **Products**.
3. Click **"Scan Barcode"** or **"Scan Webcam"**.
4. When the browser prompts **"Allow MeroPasal to use your camera"**, click **Allow**.

> **Note for Production Deployment:** 
> Web browsers require **HTTPS** (or `localhost`) to access camera hardware. If deploying to your own domain (e.g. `https://yourdomain.com`), make sure SSL/HTTPS is active.

### Step 2: Scanning Tips
- Hold the barcode **4 to 8 inches (10–20 cm)** away from the lens.
- Ensure the area is well-lit and avoid glare on shiny plastic wrappers.
- The red alignment line will turn green and play a **POS Cashier Beep** sound when detected.

---

## 3. 🔫 Handheld Barcode Scanner Guns (USB / Wireless)

Any standard retail 1D or 2D barcode scanner gun (e.g., Honeywell, Zebra, Netum, Eyoyo, Inateck) works out of the box.

### How It Works:
Barcode scanner guns act as **HID Keyboard Emulators**. When you pull the trigger, the scanner "types" the barcode numbers and automatically presses `Enter`.

### Setup Steps:
1. Plug the USB cable or 2.4GHz USB wireless dongle into your computer.
2. Open the **POS Terminal** search bar.
3. Aim the gun at a product barcode and pull the trigger.
4. The product will be automatically found and added to the cart!

> **Tip (Carriage Return / Enter Key):**
> Most scanner guns come with a quick setup sheet containing configuration barcodes. Ensure **"Add Enter Key / Carriage Return Suffix"** is scanned so the scanner automatically submits searches.

---

## 4. 🖨️ Thermal Barcode Sticker & Label Printer Setup

To print custom barcode stickers for unpackaged items (e.g. grains, fruits, clothing, local items):

### Supported Printers:
- **Xprinter** (XP-365B, XP-235B, XP-420B, etc.)
- **TSC / Zebra / Gprinter**
- Standard **58mm / 80mm** receipt & label printers

### Step-by-Step Printing:
1. **Open Sticker Generator**:
   - Go to **Products** in MeroPasal.
   - Click **"Generate Stickers"** in the top bar or click the **Barcode Icon** on any product row.
2. **Configure Label**:
   - **Product Name**: e.g., *Basmati Rice 25kg*
   - **Price**: e.g., *Rs. 2,750*
   - **Barcode Number**: Auto-generate (`890...`) or type an existing SKU code.
3. **Click "Print Sticker"**:
   - In the print dialog, select your label printer.
   - Choose paper size (e.g. `50mm x 30mm` or `58mm Roll`).
   - Set **Margins: None** and **Scale: Fit to Printable Area**.
4. Peel and stick the label onto your product or shelf!

---

## 5. 🛠️ Developer Installation & Libraries

If you are cloning or deploying the repository:

```bash
# Navigate to web app directory
cd /Users/macbookpro/projects/MeroPasal/meropasal-web

# Install all barcode dependencies
npm install @zxing/library jsbarcode canvas-confetti recharts lucide-react

# Install types
npm install -D @types/jsbarcode @types/canvas-confetti

# Run local development server
npm run dev
```

---

## 6. ❓ Troubleshooting Guide

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"Camera Permission Denied"** | Browser blocked camera access | Click the lock/camera icon in the browser address bar and set Camera to **Allow**. |
| **Barcode not scanning with camera** | Barcode too blurry or poor lighting | Move item 2 inches back and ensure good overhead light. |
| **Scanner gun types nothing** | USB cable loose or wrong port | Re-plug USB; test by scanning into a blank Notepad. |
| **Sticker printing is misaligned** | Printer page size set to A4 instead of label | In browser Print dialog, change **Paper Size** to your thermal label dimensions (e.g. 50x30mm). |
