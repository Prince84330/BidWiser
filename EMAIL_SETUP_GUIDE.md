# 📧 Email Configuration Guide for BidWiser

This guide will help you set up email configuration for sending OTP and notifications.

## 🎯 Option 1: Gmail (Recommended for Development)

### ⚠️ Important: App Passwords Availability

**App Passwords are available for:**
- ✅ Personal Gmail accounts (@gmail.com)
- ✅ Google Workspace accounts (if enabled by admin)
- ✅ Accounts with 2-Step Verification enabled

**App Passwords are NOT available for:**
- ❌ Accounts without 2-Step Verification
- ❌ Some Google Workspace accounts (admin disabled)
- ❌ Accounts that just enabled 2-Step Verification (wait 24 hours)

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click on **Security** (left sidebar)
3. Under "Signing in to Google", find **2-Step Verification**
4. Click on it and follow the prompts to enable it
   - You'll need to verify your phone number
   - This is **required** to generate App Passwords
5. **Wait a few minutes** after enabling (sometimes Google needs time to activate App Passwords)

### Step 2: Generate App Password

**Method 1: Direct Link (Easiest)**
1. Go directly to: https://myaccount.google.com/apppasswords
2. You might need to sign in
3. If you see "App passwords aren't available", see Method 2 below
4. If you see the App Passwords page:
   - Under "Select app", choose **Mail**
   - Under "Select device", choose **Other (Custom name)**
   - Type: **BidWiser**
   - Click **Generate**
   - **Copy the 16-character password** (remove spaces when using)

**Method 2: If App Passwords Option is Missing**

If you don't see "App passwords" option, try these:

**Option A: Use Google Account Settings**
1. Go to: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Scroll down to find **2-Step Verification**
4. Click on **2-Step Verification**
5. Scroll down to the bottom of the page
6. Look for **App passwords** section
7. Click on it

**Option B: Search in Google Account**
1. Go to: https://myaccount.google.com/
2. Use the search bar at the top
3. Type: **app passwords**
4. Click on the result

**Option C: If Still Not Found - Enable It**
1. Make sure 2-Step Verification is **fully enabled** (not just set up)
2. Wait 24 hours after enabling 2-Step Verification (Google sometimes requires this)
3. Try using a **personal Gmail account** (not Google Workspace/Enterprise)
4. If using Google Workspace, contact your admin - App Passwords might be disabled

**Method 3: Alternative - Use "Less Secure App Access" (Not Recommended but Works)**

⚠️ **Note**: This method is less secure and Google may disable it. Only use if App Passwords don't work.

1. Go to: https://myaccount.google.com/security
2. Look for **Less secure app access** (may not be available on all accounts)
3. Enable it temporarily
4. Use your **regular Gmail password** (not App Password)
5. **Important**: Disable this after testing and try to get App Passwords working

**Method 4: Use OAuth2 (Advanced - For Production)**

For production apps, consider using OAuth2 instead of App Passwords. This requires more setup but is more secure.

### Step 3: Add to config.env

1. Open `backend/config/config.env` file
2. Add these lines (replace with your actual values):

```env
# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
```

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_EMAIL=john.doe@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
```

**⚠️ Important Notes:**
- Use your **full Gmail address** for `SMTP_EMAIL`
- Use the **16-character App Password** (remove spaces) for `SMTP_PASSWORD`
- **DO NOT** use your regular Gmail password - it won't work!

### Step 4: Restart Server

After adding the configuration, restart your backend server:
```bash
# Stop the server (Ctrl+C)
# Then start again
npm run dev
```

---

## 🎯 Option 2: Outlook/Hotmail

If you prefer to use Outlook/Hotmail:

### Step 1: Enable App Password

1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Click **Security** → **Advanced security options**
3. Under "App passwords", click **Create a new app password**
4. Name it: **BidWiser**
5. Copy the generated password

### Step 2: Add to config.env

```env
# Email Configuration (Outlook)
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SERVICE=Outlook365
SMTP_EMAIL=your-email@outlook.com
SMTP_PASSWORD=your-app-password
```

---

## 🎯 Option 3: Custom SMTP Server

If you have your own SMTP server:

```env
# Email Configuration (Custom)
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SERVICE=your-service-name
SMTP_EMAIL=your-email@domain.com
SMTP_PASSWORD=your-password
```

---

## ✅ Testing Your Configuration

After adding the configuration:

1. **Restart your backend server**
2. **Try registering a new user**
3. **Check the backend console** - you should see:
   ```
   ✅ SMTP server connection verified successfully!
   ✅ OTP sent to user@email.com: 123456
   ```
4. **Check your email inbox** (and spam folder) for the OTP

---

## 🔍 Troubleshooting

### Problem: "SMTP server verification failed"

**Solutions:**
- Check if `SMTP_HOST` is correct
- Verify `SMTP_PORT` (587 for Gmail)
- Make sure you're using App Password, not regular password
- Check if your IP is blocked (unlikely for Gmail)

### Problem: "Invalid login"

**Solutions:**
- Make sure you're using App Password, not regular password
- Verify the App Password doesn't have spaces
- Check if 2-Step Verification is enabled
- Try generating a new App Password

### Problem: "Email not received"

**Solutions:**
- Check spam/junk folder
- Verify email address is correct
- Check backend console for errors
- In development, OTP is also logged to console

### Problem: "Connection timeout"

**Solutions:**
- Check your internet connection
- Verify firewall isn't blocking port 587
- Try using port 465 with `secure: true` (requires code change)

---

## 📝 Complete config.env Example

Here's a complete example of what your `backend/config/config.env` should look like:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here-make-it-long-and-random
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

---

## 🚀 Quick Setup Checklist

- [ ] Enabled 2-Step Verification on Gmail
- [ ] Generated App Password
- [ ] Added email config to `backend/config/config.env`
- [ ] Restarted backend server
- [ ] Tested by registering a new user
- [ ] Received OTP email (or checked console for OTP)

---

## 💡 Development Mode

If you don't want to set up email for development:

- The app will still work
- OTP will be generated and saved to database
- OTP will be logged to console: `📝 OTP for user@email.com: 123456`
- You can use the OTP from console to verify accounts

---

## 📞 Need Help?

If you're still having issues:
1. Check backend console for specific error messages
2. Verify all environment variables are set correctly
3. Make sure there are no extra spaces in your config.env file
4. Try generating a new App Password

---

**Last Updated:** 2024

