# Echo - Developer Guide

## Adding New Photos

All photos in Echo are managed through a single source of truth: `lib/photo-data.ts`

### Quick Start

1. **Add your image to the public folder**
   \`\`\`
   /public/my-awesome-photo.jpg
   \`\`\`

2. **Add the photo to the library**
   \`\`\`typescript
   // In lib/photo-data.ts
   export const photoLibrary: Photo[] = [
   // ... existing photos (currently 1-21) ...
   createPhoto({
   id: 22, // Use next available ID (current max is 21)
   name: "My Awesome Photo",
   url: "/my-awesome-photo.jpg",
   date: "January 15, 2025",
   tags: ["nature", "landscape"],
   description: "A beautiful sunset view",
   location: "Yosemite National Park"
   })
   ]
   \`\`\`

3. **Done!** The photo will automatically appear in:
   - Library view (all photos)
   - Recent photos on home page
   - Search results

### Adding Photos to Albums

To add a photo to an album, just add its ID to the album's `photoIds` array:

\`\`\`typescript
export const albums: Album[] = [
{
id: 1,
title: "Tokyo Highlights",
photoIds: [1, 2, 5, 7, 8, 9, 10, 11, 13, 18, 22], // Add your photo ID here
// ... rest of album config
}
]
\`\`\`

### Creating New Albums

Use the `createAlbum()` helper:

\`\`\`typescript
export const albums: Album[] = [
// ... existing albums (currently 3 albums) ...
createAlbum({
id: 4,
title: "Winter Wonderland",
photoIds: [22, 23, 24], // Use actual photo IDs from your library
description: "Snowy adventures",
coverPhotoId: 22 // Optional: specify cover photo
})
]
\`\`\`

## Data Structure

### Photo Object

\`\`\`typescript
{
id: number // Unique identifier
name: string // Display name
url: string // Path to image (e.g., "/photo.jpg")
date: string // Date taken
tags: string[] // Searchable tags
description?: string // Optional description
location?: string // Optional location
liked?: boolean // Favorite status
// ... camera metadata (optional)
}
\`\`\`

### Album Object

\`\`\`typescript
{
id: number // Unique identifier
title: string // Album name
photoIds: number[] // Array of photo IDs from library
description?: string // Optional description
coverPhotoId?: number // ID of cover photo (defaults to first)
}
\`\`\`

## Architecture

\`\`\`
lib/photo-data.ts → Single source of truth for all data
├── photoLibrary[] → All photos (currently 21 photos)
├── albums[] → Personal albums (currently 3 albums)
└── sharedAlbums[] → Shared albums (currently 3 albums)

components/
├── photo-card.tsx → Displays individual photos
├── album-card.tsx → Displays album cards
├── photo-batch.tsx → Search results with selection (NEW)
├── library.tsx → Shows all photos
├── albums-list.tsx → Shows all albums
└── shared-albums.tsx → Shows shared albums

app/
└── page.tsx → Main orchestration (search mode, state)
\`\`\`

## Search Feature

The search functionality is implemented with a native, single-page experience:

1. **Search Bar** (`components/search-hero.tsx`)

   - Stays in place during search
   - Compresses slightly when search is active
   - Searches through photo names, locations, tags, and descriptions

2. **Photo Batch** (`components/photo-batch.tsx`)

   - Self-contained component that displays search results
   - Includes photo grid, selection, actions bar, and album creation
   - Multi-select support (click, Shift+click, Cmd/Ctrl+click)
   - Integrated "Create Album" functionality

3. **State Management** (`app/page.tsx`)
   - `isSearchMode` - toggles between home and search view
   - `searchResults` - filtered photos from AI search
   - Smooth transitions between views

## Helper Functions

- `createPhoto()` - Create photo with defaults
- `createAlbum()` - Create album with defaults
- `getPhotoById(id)` - Get single photo
- `getPhotosByIds(ids)` - Get multiple photos
- `getAlbumThumbnails(ids)` - Get album cover thumbnails
- `validatePhotoReferences()` - Check for missing photo IDs

## Best Practices

1. **Always use the next available ID** - Check the last photo/album ID and increment
2. **Place images in /public** - They'll be accessible at `/filename.jpg`
3. **Use descriptive names** - Makes searching easier
4. **Add relevant tags** - Improves search functionality
5. **Reference, don't duplicate** - Albums reference photo IDs, not photo objects
6. **Validate references** - Run `validatePhotoReferences()` to check for errors

## Example: Adding a Batch of Photos

\`\`\`typescript
// Add multiple photos at once
const newPhotos = [
createPhoto({
id: 22, // Next available ID (current max is 21)
name: "Mountain Peak",
url: "/mountain-peak.jpg",
date: "January 15, 2025",
tags: ["mountain", "nature"]
}),
createPhoto({
id: 23,
name: "Forest Path",
url: "/forest-path.jpg",
date: "January 16, 2025",
tags: ["forest", "hiking"]
}),
]

export const photoLibrary: Photo[] = [
// ... existing photos (currently 1-21) ...
...newPhotos
]

// Create an album with these photos
export const albums: Album[] = [
// ... existing albums (currently 3 albums) ...
createAlbum({
id: 4,
title: "Nature Collection",
photoIds: [22, 23]
})
]
\`\`\`

## Troubleshooting

**Photo not showing up?**

- Check the file path is correct (starts with `/`)
- Verify the image is in the `/public` folder
- Make sure the ID is unique

**Album showing broken images?**

- Run `validatePhotoReferences()` to find missing IDs
- Check that all photo IDs in the album exist in photoLibrary

**Need to update a photo?**

- Find it in photoLibrary by ID
- Update the properties you need
- Changes will reflect everywhere the photo is used
