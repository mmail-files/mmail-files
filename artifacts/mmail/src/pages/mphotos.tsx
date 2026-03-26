import * as React from "react";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, Plus, Search, Grid3X3, LayoutGrid, Star,
  Share2, Trash2, Download, X, ChevronLeft, ChevronRight,
  Image as ImageIcon, FolderOpen, Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { photos as configPhotos, albumExtras, type PhotoEntry } from "@/photos-config";

const BASE = import.meta.env.BASE_URL;

function photoSrc(filename: string) {
  return `${BASE}photos/${filename}`;
}

function buildAlbums(photos: PhotoEntry[]) {
  const map: Record<string, number> = {};
  for (const p of photos) {
    const name = p.album ?? "Uncategorised";
    map[name] = (map[name] ?? 0) + 1;
  }
  const emojiMap: Record<string, string> = {};
  for (const e of albumExtras) emojiMap[e.name] = e.emoji;
  const defaultEmojis = ["📁", "🖼️", "🌟", "📷", "🎉", "🌍"];
  return Object.entries(map).map(([name, count], i) => ({
    name,
    count,
    emoji: emojiMap[name] ?? defaultEmojis[i % defaultEmojis.length],
  }));
}

interface DisplayPhoto extends PhotoEntry {
  id: string;
}

function PhotoCard({
  photo,
  onClick,
}: {
  photo: DisplayPhoto;
  onClick: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 bg-muted"
      onClick={onClick}
    >
      {imgError ? (
        <div className="w-full h-full min-h-[180px] flex flex-col items-center justify-center text-muted-foreground gap-2 p-4">
          <ImageIcon className="h-8 w-8 opacity-30" />
          <p className="text-xs text-center opacity-60 truncate max-w-full">{photo.filename}</p>
        </div>
      ) : (
        <img
          src={photoSrc(photo.filename)}
          alt={photo.label}
          onError={() => setImgError(true)}
          className="w-full h-full min-h-[180px] object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-200" />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <p className="text-white text-sm font-medium truncate">{photo.label}</p>
        <p className="text-white/70 text-xs">{photo.date}</p>
      </div>

      {photo.starred && (
        <div className="absolute top-2 right-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow" />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
        <FolderOpen className="h-10 w-10 text-muted-foreground opacity-50" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No photos yet</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        Add your photos in two quick steps:
      </p>

      <div className="text-left w-full max-w-md space-y-4">
        <div className="flex gap-4 items-start bg-muted/50 rounded-xl p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
            1
          </div>
          <div>
            <p className="font-medium text-sm">Upload your image files</p>
            <p className="text-muted-foreground text-sm mt-1">
              Drag and drop image files into this folder in the file tree:
            </p>
            <code className="inline-block mt-2 px-3 py-1.5 bg-background rounded-lg text-xs font-mono border border-border">
              artifacts/mmail/public/photos/
            </code>
          </div>
        </div>

        <div className="flex gap-4 items-start bg-muted/50 rounded-xl p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
            2
          </div>
          <div>
            <p className="font-medium text-sm">Add an entry to the config file</p>
            <p className="text-muted-foreground text-sm mt-1">
              Open this file and add your photo details:
            </p>
            <code className="inline-block mt-2 px-3 py-1.5 bg-background rounded-lg text-xs font-mono border border-border">
              artifacts/mmail/src/photos-config.ts
            </code>
            <div className="mt-3 bg-background rounded-lg p-3 border border-border font-mono text-xs leading-relaxed">
              <span className="text-muted-foreground">{"{"}</span><br />
              {"  "}<span className="text-blue-500">filename</span>: <span className="text-green-600">"my-photo.jpg"</span>,<br />
              {"  "}<span className="text-blue-500">label</span>: <span className="text-green-600">"My Photo"</span>,<br />
              {"  "}<span className="text-blue-500">date</span>: <span className="text-green-600">"Mar 26, 2026"</span>,<br />
              {"  "}<span className="text-blue-500">starred</span>: <span className="text-orange-500">false</span>,<br />
              {"  "}<span className="text-blue-500">album</span>: <span className="text-green-600">"Memories"</span>,<br />
              <span className="text-muted-foreground">{"}"}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-8 text-muted-foreground text-sm">
        The page will refresh automatically once you save the config.
      </p>
    </div>
  );
}

export default function MPhotos() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "albums">("grid");
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [selected, setSelected] = useState<DisplayPhoto | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allPhotos: DisplayPhoto[] = configPhotos.map((p, i) => ({
    ...p,
    id: String(i),
  }));

  const albums = buildAlbums(allPhotos);

  const inAlbum = activeAlbum
    ? allPhotos.filter((p) => (p.album ?? "Uncategorised") === activeAlbum)
    : allPhotos;

  const filtered = inAlbum.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase())
  );

  const openPhoto = (photo: DisplayPhoto) => {
    const idx = filtered.indexOf(photo);
    setSelected(photo);
    setSelectedIndex(idx);
  };

  const prevPhoto = () => {
    const idx = (selectedIndex - 1 + filtered.length) % filtered.length;
    setSelected(filtered[idx]);
    setSelectedIndex(idx);
  };

  const nextPhoto = () => {
    const idx = (selectedIndex + 1) % filtered.length;
    setSelected(filtered[idx]);
    setSelectedIndex(idx);
  };

  const LightboxImage = ({ photo }: { photo: DisplayPhoto }) => {
    const [err, setErr] = useState(false);
    return err ? (
      <div className="w-80 h-80 rounded-3xl bg-muted flex flex-col items-center justify-center gap-3 shadow-2xl">
        <ImageIcon className="h-16 w-16 text-muted-foreground opacity-40" />
        <p className="text-muted-foreground text-sm">{photo.filename}</p>
      </div>
    ) : (
      <img
        src={photoSrc(photo.filename)}
        alt={photo.label}
        onError={() => setErr(true)}
        className="max-h-[70vh] max-w-[80vw] rounded-2xl object-contain shadow-2xl"
      />
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-4 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 shadow-md">
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Mphotos</span>
          </div>
          {activeAlbum && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{activeAlbum}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setActiveAlbum(null)}
              >
                ✕ Clear
              </Button>
            </>
          )}
        </div>

        <div className="flex-1 max-w-xl px-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search photos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary/30 focus-visible:ring-4 focus-visible:ring-primary/10 rounded-full pl-10 pr-4 h-11 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("grid")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "albums" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setView("albums")}
            className="text-muted-foreground hover:text-foreground"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Avatar className="h-9 w-9 border border-border/50 shadow-sm ml-1">
            <AvatarImage src={`${BASE}images/avatar.png`} alt="Mavandeep" className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">M</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {view === "albums" ? (
          <div className="max-w-5xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6">Albums</h2>
            {albums.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {albums.map((album) => (
                  <div
                    key={album.name}
                    className="group cursor-pointer"
                    onClick={() => { setActiveAlbum(album.name); setView("grid"); }}
                  >
                    <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02] overflow-hidden">
                      {allPhotos.find((p) => (p.album ?? "Uncategorised") === album.name) ? (
                        <img
                          src={photoSrc(allPhotos.find((p) => (p.album ?? "Uncategorised") === album.name)!.filename)}
                          alt={album.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : null}
                      <span className="text-5xl absolute">{album.emoji}</span>
                    </div>
                    <p className="mt-2 font-semibold text-sm truncate">{album.name}</p>
                    <p className="text-xs text-muted-foreground">{album.count} {album.count === 1 ? "item" : "items"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{activeAlbum ?? "Photos"}</h2>
              {filtered.length > 0 && (
                <Badge variant="secondary" className="rounded-full">
                  {filtered.length} {filtered.length === 1 ? "photo" : "photos"}
                </Badge>
              )}
            </div>

            {allPhotos.length === 0 ? (
              <EmptyState />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <ImageIcon className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">No photos found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4" style={{ gridAutoRows: "180px" }}>
                {filtered.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} onClick={() => openPhoto(photo)} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={() => setSelected(null)}
        >
          <div
            className="flex items-center justify-between px-6 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white">
              <p className="font-semibold">{selected.label}</p>
              <p className="text-white/60 text-sm">{selected.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Star className={`h-5 w-5 ${selected.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Download className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Trash2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full ml-2"
                onClick={() => setSelected(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div
            className="flex-1 flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/10 rounded-full h-12 w-12 z-10"
              onClick={prevPhoto}
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>

            <LightboxImage photo={selected} />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/10 rounded-full h-12 w-12 z-10"
              onClick={nextPhoto}
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
          </div>

          <div
            className="flex items-center justify-center gap-2 px-6 py-4 overflow-x-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {filtered.map((p, i) => (
              <div
                key={p.id}
                onClick={() => { setSelected(p); setSelectedIndex(i); }}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden cursor-pointer transition-all bg-muted ${i === selectedIndex ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"}`}
              >
                <img
                  src={photoSrc(p.filename)}
                  alt={p.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
