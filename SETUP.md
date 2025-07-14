# MyStore Admin Dashboard Setup

## Features Added

✅ **Sidebar Navigation** - Clean admin panel with sidebar navigation
✅ **Products Management** - Full CRUD operations for products
✅ **Product Modal** - Add new products with form validation
✅ **Image Upload** - Cloud storage integration with Cloudinary (with fallback)
✅ **Products List** - Display all products in a table format
✅ **Edit/Delete** - Manage existing products
✅ **Clothing Categories** - Specialized categories for clothing items

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string_here
MONGODB_DB=your_database_name_here

# Cloudinary Configuration (for image uploads) - OPTIONAL
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Image Upload Setup

### Option 1: With Cloudinary (Recommended)
1. Sign up for a free account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Add them to your `.env.local` file
4. Images will be stored in the cloud with secure URLs

### Option 2: Without Cloudinary (Fallback)
- If Cloudinary is not configured, images will be stored as base64 in the database
- This works for development but is not recommended for production
- No additional setup required

## Product Fields

- **Title** - Product name (required, max 100 characters)
- **Price** - Product price (required, numeric)
- **Image** - Product image (required, uploaded to Cloudinary or stored as base64)
- **Description** - Product description (required, max 500 characters)
- **Category** - Product category (required, predefined options)

## Available Categories

### Clothing Categories (Primary)
- **Fancy** - Fancy clothing items
- **Heavy Dress** - Heavy traditional dresses
- **Light Dress** - Light and casual dresses
- **Embroidery Work** - Items with embroidery
- **Mirror Work** - Items with mirror work
- **Mukesh** - Items with mukesh work
- **Tarkashi** - Items with tarkashi work
- **Shadow Work** - Items with shadow work

### Other Categories
- Electronics
- Books
- Home & Garden
- Sports
- Other

## API Endpoints

- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `POST /api/upload` - Upload image to Cloudinary

## Troubleshooting

### Image Upload Error
If you get "error uploading image please try again":

1. **Check Cloudinary Setup**:
   - Ensure all Cloudinary environment variables are set
   - Verify your Cloudinary credentials are correct
   - Check the browser console for detailed error messages

2. **Fallback Method**:
   - The system will automatically use base64 storage if Cloudinary fails
   - This allows you to continue adding products even without cloud storage

3. **Environment Variables**:
   - Make sure your `.env.local` file is in the project root
   - Restart your development server after adding environment variables

## Usage

1. Login as admin at `/login`
2. Navigate to the admin dashboard at `/admin`
3. Click on "Products" in the sidebar
4. Use "Add Product" to create new products
5. Select appropriate category for your clothing items
6. View, edit, or delete existing products in the table

## File Structure

```
app/
├── admin/
│   ├── components/
│   │   ├── ProductModal.tsx
│   │   └── ProductsList.tsx
│   ├── AdminDashboard.tsx
│   └── page.tsx
├── api/
│   ├── products/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── upload/route.ts
├── lib/
│   ├── mongodb.ts
│   └── cloudinary.ts
└── models/
    └── Product.ts
``` 