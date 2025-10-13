# Bookadzone Admin Panel


This is the admin panel for the Bookadzone application, built with React, TypeScript, and Vite.

## Technologies Used

- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript superset
- **Vite**: Modern frontend build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: State management
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Icons**: Icon library
- **SweetAlert2**: Beautiful, responsive, customizable alert dialogs
- **React Toastify**: Toast notifications
- **Framer Motion**: Animation library

## Project Structure

```
bookadzone-admin/
├── src/
│   ├── components/
│   │   ├── atoms/         # Basic UI components (buttons, inputs, etc.)
│   │   ├── molecules/     # Composite components (form fields, headers)
│   │   ├── organisms/     # Complex UI patterns (tables, forms)
│   │   ├── pages/         # Page components
│   │   ├── providers/     # Context providers
│   │   ├── shared/        # Shared utilities and components
│   │   ├── stores/        # Zustand state stores
│   │   ├── templates/     # Page layout templates
│   │   ├── types/         # TypeScript definitions
│   │   └── utils/         # Utility functions
│   ├── assets/            # Static assets
│   ├── styles/            # Global styles
│   └── data/             # Static data files
```

## Key Features

### Table Management System
The application includes a robust table management system with the following features:

#### ManagementTable Component
```tsx
<ManagementTable
  data={items}
  columns={columns}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleStatus={handleToggleStatus}
  currentPage={currentPage}
  limit={itemsPerPage}
  module="moduleName"
/>
```

Features:
- Responsive design with horizontal scrolling
- Empty state handling ("No data available" message)
- Row numbering with pagination support
- Status badges (Active/Inactive)
- Action buttons (Edit, Delete, View, Restore)
- Customizable columns with render functions
- Animation using Framer Motion

#### TableHeader Component
```tsx
<TableHeader
  managementName="Section Name"
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  addButtonLabel="Add"
  addButtonLink="/section/add"
  statFilters={statFilters}
  selectedFilterId={selectedFilter}
  onSelectFilter={handleFilterChange}
  module="moduleName"
/>
```

Features:
- Search functionality
- Status filters (All, Active, Inactive)
- Add new item button
- Statistics display
- Responsive design

### State Management
Using Zustand for state management with the following features:

```typescript
interface Store {
  items: Item[];
  loading: boolean;
  error: string | null;
  stats: { total: number; active: number; inactive: number };
  fetchItems: (page: number, limit: number, filter?: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  // ... other actions
}
```

Features:
- Centralized state management
- TypeScript type safety
- Loading and error states
- Pagination support
- Filtering capabilities
- Statistics tracking

### Error Handling
Comprehensive error handling system:

```typescript
try {
  await action();
} catch (error) {
  toast.error(error.message);
  console.error('Operation failed:', error);
}
```

Features:
- Toast notifications for user feedback
- Console logging for debugging
- Error boundary components
- Type-safe error handling
- Graceful fallbacks

### Form Management
Form handling with validation and file uploads:

```typescript
const methods = useForm<FormData>({
  defaultValues: {
    // ... default values
  },
  mode: 'onSubmit'
});
```

Features:
- Form validation
- File upload support
- Dynamic field updates
- Error messaging
- Loading states

## Common Actions

### Adding New Records
```typescript
const handleAdd = async (data: FormData) => {
  try {
    await addItem(data);
    toast.success('Item added successfully');
    navigate('/items');
  } catch (error) {
    toast.error('Failed to add item');
  }
};
```

### Updating Records
```typescript
const handleUpdate = async (id: string, data: FormData) => {
  try {
    await updateItem(id, data);
    toast.success('Item updated successfully');
    navigate('/items');
  } catch (error) {
    toast.error('Failed to update item');
  }
};
```

### Deleting Records
```typescript
const handleDelete = async (item: Item) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    try {
      await deleteItem(item.id);
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  }
};
```

### Status Toggle
```typescript
const handleStatusToggle = async (item: Item) => {
  try {
    await toggleStatus(item.id);
    toast.success('Status updated successfully');
  } catch (error) {
    toast.error('Failed to update status');
  }
};
```

## API Integration

### Base Configuration
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Common Endpoints
- GET `/api/items` - List items with pagination
- POST `/api/items` - Create new item
- PUT `/api/items/:id` - Update item
- DELETE `/api/items/:id` - Delete item
- PATCH `/api/items/:id/toggle-status` - Toggle item status

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## Environment Setup

Create a `.env` file with:
```env
VITE_API_URL=http://localhost:3000
VITE_FILE_URL=http://localhost:3000/uploads/
```

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Update variables as needed

4. Start development server:
```bash
npm run dev
```

## Best Practices

### Component Organization
- Use atomic design pattern
- Keep components small and focused
- Use TypeScript for type safety
- Implement proper error handling
- Follow consistent naming conventions

### State Management
- Centralize state in Zustand stores
- Use local state for UI-specific data
- Implement proper loading states
- Handle errors gracefully
- Use TypeScript for type safety

### Performance
- Implement pagination
- Use lazy loading
- Memoize expensive computations
- Optimize images and assets
- Minimize bundle size

## Troubleshooting

### Common Issues
1. Build failures:
   - Clear `node_modules`
   - Delete `package-lock.json`
   - Run `npm install`

2. API connection issues:
   - Check environment variables
   - Verify API is running
   - Check network tab for errors
   - Validate auth token

3. TypeScript errors:
   - Check type definitions
   - Update dependencies
   - Clear TypeScript cache
   - Run `tsc --noEmit`

## Contributing

1. Create a feature branch:
```bash
git checkout -b feature/your-feature
```

2. Make changes and commit:
```bash
git commit -m "feat: add your feature"
```

3. Push changes:
```bash
git push origin feature/your-feature
```

4. Create a Pull Request