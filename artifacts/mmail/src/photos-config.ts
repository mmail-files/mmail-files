// ============================================================
//  MPHOTOS CONFIGURATION
//  To add a photo:
//  1. Upload your image file into: artifacts/mmail/public/photos/
//  2. Copy one of the entries below and fill in the details
// ============================================================

export interface PhotoEntry {
  filename: string;   // the image filename inside public/photos/ (e.g. "trip.jpg")
  label: string;      // display name shown on hover and in the lightbox
  date: string;       // date string shown in the lightbox (e.g. "Mar 26, 2026")
  starred?: boolean;  // show a gold star badge — set to true for favourites
  album?: string;     // optional album name for grouping
}

export const photos: PhotoEntry[] = [
  // --- Add your photos below ---
  // {
  //   filename: "my-photo.jpg",
  //   label: "My Photo",
  //   date: "Mar 26, 2026",
  //   starred: false,
  //   album: "Memories",
  // },
];

// ============================================================
//  ALBUMS
//  Albums are automatically built from the "album" field
//  above.  You can also define extra albums with a custom
//  cover emoji here.
// ============================================================

export interface AlbumEntry {
  name: string;
  emoji: string;
}

export const albumExtras: AlbumEntry[] = [
  // { name: "Holidays", emoji: "🌴" },
];
