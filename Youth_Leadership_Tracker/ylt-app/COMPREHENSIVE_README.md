# Youth Leadership Tracker (YLT)

A comprehensive Angular 20+ web application for managing members of an AIESEC local committee and tracking their leadership experiences with an integrated analytics dashboard.

## 🎯 Overview

The Youth Leadership Tracker is a complete CRUD application designed for AIESEC committees to:
- Manage committee members with detailed profiles
- Track leadership experiences (Team Leader, OC, VP, etc.)
- View analytics and statistics through a comprehensive dashboard
- Manage user profiles and authentication

## ✨ Key Features

### 1. **Authentication Module**
- Secure login with email and password
- Maximum 3 login attempts before 5-minute lockout
- Mock user system with token-based authentication
- Session management via localStorage

**Demo Credentials:**
- Email: `ahmed@aiesec.org` | Password: `password123`
- Email: `fatima@aiesec.org` | Password: `password123`

### 2. **Members Management (CRUD #1)**
- **Create**: Add new members with full details
- **Read**: View members in a sortable, filterable list
- **Update**: Edit member information
- **Delete**: Remove members with confirmation
- **Features**:
  - Advanced search (name, email, department)
  - Filter by department (TM, TL, OGX, ICX, ER, VP, OC, EST)
  - Sort by name, email, department, or date
  - Pagination (6 items per page)
  - Member detail page with linked experiences

### 3. **Experiences Management (CRUD #2)**
- **Create**: Add leadership experiences to members
- **Read**: View experiences with advanced filtering
- **Update**: Edit experience details
- **Delete**: Remove experiences with confirmation
- **Features**:
  - Filter by role (Team Member, Team Leader, OC, VP, etc.)
  - Filter by department
  - Filter by status (Active, Completed, Upcoming)
  - Advanced search
  - Pagination (5 items per page)
  - Experience detail page with member information

### 4. **Analytics Dashboard**
Real-time statistics including:
- **Total Members**: Count of all registered members
- **Total Experiences**: Count of all leadership experiences
- **Active Experiences**: Currently ongoing experiences
- **Completed Experiences**: Finished experiences
- **Top Skills**: Most developed competencies
- **Members by Department**: Distribution across departments
- **Experiences by Role**: Breakdown by leadership roles
- **Visual Progress Bars**: Easy to understand metrics
- **Quick Action Cards**: Fast navigation to main sections

### 5. **User Profile**
- View current user information
- Edit profile details (name, email, department, role, bio)
- Security information display
- Account management options
- Logout functionality

### 6. **Navigation**
- Responsive navigation bar (visible only when authenticated)
- Quick links to all main sections
- Professional footer with information
- Mobile-friendly responsive design

## 🏗️ Architecture

### Technology Stack
- **Frontend Framework**: Angular 20+ (standalone components)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS
- **State Management**: RxJS Observables
- **Forms**: Reactive Forms & Template-driven Forms
- **Routing**: Lazy loading with route guards
- **Storage**: localStorage for persistence

### Project Structure
```
src/
├── app/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── members.service.ts
│   │   ├── experiences.service.ts
│   │   └── dashboard.service.ts
│   ├── models/
│   │   ├── member.ts
│   │   ├── experience.ts
│   │   ├── auth.ts
│   │   └── enums.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── features/
│   │   ├── auth/login/
│   │   ├── members/
│   │   │   ├── members-list/
│   │   │   ├── member-form/
│   │   │   └── member-detail/
│   │   ├── experiences/
│   │   │   ├── experiences-list/
│   │   │   ├── experience-form/
│   │   │   └── experience-detail/
│   │   ├── dashboard/
│   │   └── profile/
│   ├── app.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── main.ts
├── styles.css
└── index.html
```

## 🔐 Data Models

### Member
```typescript
{
  id: number;
  fullName: string;
  email: string;
  department: string; // TM, OGX, ICX, ER, VP, OC, EST
  age?: number;
  skills: string[]; // Array of soft skills
  createdAt: Date;
  updatedAt: Date;
}
```

### Experience
```typescript
{
  id: number;
  role: string; // Team Member, Team Leader, OC, VP, etc.
  department: string;
  description: string;
  startDate: Date;
  endDate: Date | null; // null for ongoing experiences
  skillsGained: string[];
  memberId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### User (Authentication)
```typescript
{
  id: number;
  fullName: string;
  email: string;
  department: string;
  role: string;
  profileImageUrl?: string;
  bio?: string;
}
```

## 📊 Available Skills
- Teamwork
- Communication
- Leadership
- Adaptability
- Problem Solving
- Time Management
- Creativity
- Project Management
- Decision Making
- Strategic Thinking

## 📋 Department Types
- **TM** - Team Member
- **TL** - Team Leader
- **OGX** - Organizational
- **ICX** - International Cooperation
- **ER** - Experience Research
- **VP** - Vice President
- **OC** - Organizational Committee
- **EST** - External

## 🚀 Getting Started

### Installation
```bash
cd Youth_Leadership_Tracker/ylt-app
npm install
```

### Development Server
```bash
ng serve --open
# Application will open at http://localhost:4200/
```

### Production Build
```bash
ng build --configuration production
# Output in dist/ylt-app/
```

## 🔄 Data Persistence

The application uses **localStorage** to persist data:
- **Members**: `ylt_members`
- **Experiences**: `ylt_experiences`
- **User Data**: `ylt_user`
- **Authentication**: `ylt_token`
- **Login Attempts**: `ylt_login_attempts`
- **Account Lockout**: `ylt_lockout_time`

**Note**: All data is cleared when browser storage is cleared.

## ⚙️ Features Implementation

### Authentication
- ✅ Login form with validation
- ✅ 3-attempt maximum before lockout
- ✅ 5-minute account lockout
- ✅ Token generation and storage
- ✅ Route guards for protected pages

### Forms
- ✅ Reactive Forms (Experiences, Members)
- ✅ Template-driven Forms (Login)
- ✅ Custom validators
- ✅ Form error messages
- ✅ Form state management

### CRUD Operations
- ✅ Create members/experiences
- ✅ Read with list and detail views
- ✅ Update with form validation
- ✅ Delete with confirmation dialogs

### Search & Filter
- ✅ Full-text search
- ✅ Filter by category
- ✅ Multi-filter support
- ✅ Sort options
- ✅ Pagination

### UI/UX
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ TailwindCSS styling
- ✅ Modern color scheme (Blue & Indigo)
- ✅ Loading states
- ✅ Success/Error notifications
- ✅ Empty states
- ✅ Confirmation dialogs

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Configuration

### TailwindCSS
Already configured with:
- Custom color scheme (Blue, Indigo, Purple)
- Responsive utilities
- Smooth animations
- Shadow effects

### TypeScript
- Strict mode enabled
- Type checking for all files
- Interface-based architecture

## 📚 Key Services

### AuthService
- User authentication
- Token management
- Login attempt tracking
- Account lockout management

### MembersService
- CRUD operations for members
- Search functionality
- Filter by department
- In-memory storage with localStorage persistence

### ExperiencesService
- CRUD operations for experiences
- Filter by role, department, status
- Active/completed experience separation
- Member linking

### DashboardService
- Statistics calculation
- Skill aggregation
- Department-based analytics
- Real-time data updates

## 🛡️ Security Considerations

- Route guards prevent unauthorized access
- Mock authentication with token validation
- Password stored in mock database only
- Account lockout protection
- Input validation on all forms
- XSS protection through Angular's built-in sanitization

## 📈 Performance Optimizations

- Lazy loading of route components
- OnPush change detection strategy ready
- RxJS subscription management with takeUntil
- Efficient list rendering with trackBy functions
- Minimal bundle size with tree-shaking

## 🎨 Styling Highlights

- Modern gradient backgrounds
- Smooth transitions and hover effects
- Color-coded status badges
- Accessible button designs
- Clear visual hierarchy
- Consistent spacing and sizing

## 🧪 Testing Ready

The application structure supports:
- Unit testing with Jasmine/Karma
- Component testing
- Service testing
- E2E testing with Cypress or Playwright

## 📝 Usage Examples

### Creating a Member
1. Navigate to Members → + Add New Member
2. Fill in the form with required information
3. Select skills from the available options
4. Click "Create Member"

### Adding an Experience
1. Navigate to Experiences → + Add Experience
2. Select the member from dropdown
3. Choose role and department
4. Set dates and select skills gained
5. Click "Create Experience"

### Viewing Dashboard
1. Navigate to Dashboard
2. View real-time statistics
3. See top skills and department distribution
4. Access quick action cards for navigation

### Editing Profile
1. Navigate to Profile
2. Click "Edit Profile"
3. Update your information
4. Click "Save Changes"

## 🚦 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is part of the AIESEC Youth Leadership Tracker initiative.

## 🤝 Contributing

To extend the application:

1. **Add New Features**: Create components in the features directory
2. **Extend Models**: Add properties to interfaces in models directory
3. **Create Services**: Add new services in services directory
4. **Update Routes**: Modify app.routes.ts for new pages

## 🐛 Troubleshooting

### Application won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
ng serve
```

### Build errors
```bash
# Clean build
ng build --configuration development --watch
```

### Data not persisting
- Check browser localStorage is enabled
- Verify no private/incognito mode
- Clear browser cache if needed

## 📞 Support

For issues or questions:
1. Check the component documentation
2. Review service implementations
3. Check browser console for errors
4. Verify data in localStorage using browser DevTools

## 🎓 Learning Resources

This project demonstrates:
- Angular 20+ standalone components
- TypeScript interfaces and types
- RxJS observables and operators
- Reactive Forms
- Route guards and lazy loading
- Tailwind CSS for responsive design
- Component composition
- Service architecture
- State management patterns

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Built with**: Angular 20+, TypeScript 5+, Tailwind CSS
