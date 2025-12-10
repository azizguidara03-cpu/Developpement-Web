# Youth Leadership Tracker - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Navigate to Project
```bash
cd Youth_Leadership_Tracker/ylt-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm start
# or
ng serve --open
```

The application will automatically open at **http://localhost:4200/**

---

## 🔑 Demo Credentials

Use these to login:

| Email | Password | Role |
|-------|----------|------|
| ahmed@aiesec.org | password123 | Vice President |
| fatima@aiesec.org | password123 | Organizational Committee |

---

## 📍 Main Routes

| Route | Description | Requires Login |
|-------|-------------|---|
| `/login` | Authentication page | No |
| `/dashboard` | Analytics & statistics | Yes |
| `/members` | Members list | Yes |
| `/members/create` | Create new member | Yes |
| `/members/:id` | Member details | Yes |
| `/members/:id/edit` | Edit member | Yes |
| `/experiences` | Experiences list | Yes |
| `/experiences/create` | Create new experience | Yes |
| `/experiences/:id` | Experience details | Yes |
| `/experiences/:id/edit` | Edit experience | Yes |
| `/profile` | User profile | Yes |

---

## 🎯 Core Features Overview

### 1️⃣ Login & Authentication
- Enter email and password
- System prevents 3+ failed attempts
- 5-minute lockout after failures
- Navigate to dashboard after successful login

### 2️⃣ Members Management
**List Page**: View all members with search, filter, sort, and pagination
**Create Page**: Add new member with skills selection
**Detail Page**: View member profile and their linked experiences
**Edit Page**: Modify member information

### 3️⃣ Experiences Management
**List Page**: View leadership experiences with advanced filtering
**Create Page**: Assign experience to a member
**Detail Page**: Full experience details with member info
**Edit Page**: Update experience details

### 4️⃣ Dashboard
- **Real-time Statistics**: Total members, experiences, active/completed
- **Top Skills Chart**: Most developed competencies
- **Department Distribution**: Members per department
- **Role Distribution**: Experiences by leadership role
- **Quick Actions**: Fast navigation cards

### 5️⃣ Profile Management
- View current user information
- Edit profile (name, email, bio, etc.)
- See account security information
- Logout button

---

## 🛠️ Development Commands

### Build Application
```bash
npm run build
```

### Build for Production
```bash
npm run build -- --configuration production
```

### Run Tests
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

### Watch Mode (Rebuilds on file changes)
```bash
ng serve
```

---

## 📦 Project Structure

```
src/
├── app/
│   ├── features/          # Feature modules/components
│   ├── services/          # Core services
│   ├── models/            # TypeScript interfaces
│   ├── guards/            # Route guards
│   └── shared/            # Shared utilities
├── main.ts                # Angular bootstrap
└── styles.css             # Global styles
```

---

## 💾 Data Storage

The app uses **browser localStorage** for data persistence:

- **Members**: Stored automatically
- **Experiences**: Stored automatically
- **User Session**: Stored on login
- **Preferences**: Stored for user settings

**⚠️ Note**: Data is cleared when you clear browser cache/storage

---

## 🎨 UI Components & Design

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Indigo (#4F46E5)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Danger**: Red (#EF4444)

### Typography
- **Headings**: Bold, large font
- **Body**: Clear, readable gray text
- **Labels**: Small, medium weight

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🔍 Common Tasks

### Add a New Member
1. Click "Members" in navbar
2. Click "+ Add New Member"
3. Fill form: Name, Email, Department, Age, Skills
4. Click "Create Member"

### Create an Experience for a Member
1. Click "Experiences" in navbar
2. Click "+ Add Experience"
3. Select member from dropdown
4. Fill: Role, Department, Description, Dates, Skills
5. Click "Create Experience"

### View Member Analytics
1. Click "Dashboard" in navbar
2. Scroll to see all statistics
3. View charts and distributions

### Edit Your Profile
1. Click "Profile" in navbar
2. Click "Edit Profile"
3. Update information
4. Click "Save Changes"

### Search & Filter
**Members List**:
- Search box: Type name, email, or department
- Department dropdown: Filter by department
- Sort dropdown: Order by name, email, department, or date

**Experiences List**:
- Search box: Type role, department, or description
- Role filter: Filter by role type
- Department filter: Filter by department
- Status filter: Active, Completed, or All

---

## 📊 Dashboard Metrics Explained

| Metric | Definition |
|--------|-----------|
| **Total Members** | Count of all registered members |
| **Total Experiences** | Count of all leadership experiences |
| **Active Experiences** | Experiences currently in progress |
| **Completed Experiences** | Finished experiences |
| **Top Skills** | Most frequently developed skills |
| **Members by Department** | Distribution across departments |
| **Experiences by Role** | Distribution by leadership roles |

---

## 🔒 Authentication Details

### How Login Works
1. User enters email and password
2. System checks against mock database
3. If match: Generates token and redirects to dashboard
4. If no match: Increments failed attempts
5. After 3 failures: Locks account for 5 minutes

### Route Protection
- **Auth Guard**: Prevents access to protected routes without login
- **Automatic Redirect**: Redirects to login if session expires
- **Token Storage**: Session stored in localStorage

---

## ✅ Form Validation

### Member Form
- **Full Name**: Required
- **Email**: Required, must be valid email
- **Department**: Required
- **Age**: Optional
- **Skills**: Required (select at least 1)

### Experience Form
- **Member**: Required
- **Role**: Required
- **Department**: Required
- **Description**: Required
- **Start Date**: Required
- **End Date**: Optional (leave empty for ongoing)
- **Skills**: Required (select at least 1)

### Login Form
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters

---

## 🐛 Troubleshooting

### "Cannot find module" Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Port 4200 Already in Use
```bash
# Specify different port
ng serve --port 4201
```

### Data Not Appearing
1. Check browser console (F12 → Console tab)
2. Verify localStorage is enabled
3. Clear browser cache and reload
4. Check if in private/incognito mode (not supported)

### Styles Not Loading
```bash
# Rebuild with styles
ng serve --poll
```

---

## 📱 Browser DevTools Tips

### View Stored Data
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage"
4. Find and expand the domain
5. See all stored data (members, experiences, user, token)

### Debug Services
1. Open DevTools Console
2. Services are available globally
3. Example: `localStorage.getItem('ylt_members')`

### Monitor Network
1. Go to "Network" tab
2. All API calls (even mocked) appear here
3. Check response times and data

---

## 🎓 What You're Learning

This project teaches:
- ✅ Angular 20+ with standalone components
- ✅ TypeScript interfaces and types
- ✅ Reactive programming with RxJS
- ✅ Reactive Forms validation
- ✅ Route guards and lazy loading
- ✅ Service architecture patterns
- ✅ TailwindCSS responsive design
- ✅ Component composition
- ✅ State management with observables

---

## 📚 Additional Resources

### Angular Documentation
- [Angular Official Docs](https://angular.io/docs)
- [Standalone Components](https://angular.io/guide/standalone-components)
- [Reactive Forms](https://angular.io/guide/reactive-forms)
- [RxJS Documentation](https://rxjs.dev/)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Component Library](https://tailwindcss.com/components)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🚀 Next Steps

### Extend the Application
1. **Add More Skills**: Edit `src/app/models/enums.ts`
2. **Customize Colors**: Modify `tailwind.config.js`
3. **Add Real API**: Replace mock services with HTTP calls
4. **Add Authentication**: Implement real login backend
5. **Add Charts**: Integrate Chart.js for better visualizations
6. **Add Export**: Export data to PDF/Excel

### Deploy
```bash
# Build for production
npm run build -- --configuration production

# Output in dist/ylt-app/
# Deploy to Firebase, Netlify, Vercel, or any static hosting
```

---

## 💡 Pro Tips

1. **Use Keyboard Shortcuts**: Tab through form fields
2. **Search is Real-Time**: Results update as you type
3. **Pagination Saves Position**: Scroll position is preserved
4. **Filters Stack**: Use multiple filters together
5. **Mobile Optimized**: Test on different screen sizes
6. **Accessibility**: All forms are keyboard accessible

---

## 📞 Getting Help

If you encounter issues:

1. **Check Console**: Open DevTools (F12) → Console tab
2. **Verify Data**: Check localStorage in Application tab
3. **Clear Cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Restart Server**: Kill process and run `ng serve` again
5. **Check Route**: Ensure you're on correct URL path

---

**Happy Coding! 🎉**

Version: 1.0.0 | Built with Angular 20+, TypeScript 5+, Tailwind CSS
