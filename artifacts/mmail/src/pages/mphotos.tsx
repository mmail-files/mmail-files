import * as React from "react";
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Search, Grid3X3, LayoutGrid, Star, Share2, Trash2, Download, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ALBUMS = [
  { id: "1", name: "Trip to Vancouver", count: 24, color: "from-blue-400 to-cyan-500", emoji: "🏔️" },
  { id: "2", name: "Birthday Party", count: 18, color: "from-pink-400 to-rose-500", emoji: "🎂" },
  { id: "3", name: "Screenshots", count: 47, color: "from-violet-400 to-purple-500", emoji: "📸" },
  { id: "4", name: "Family", count: 31, color: "from-amber-400 to-orange-500", emoji: "👨‍👩‍👧" },
];

interface Photo {
  id: string;
  label: string;
  date: string;
  starred: boolean;
  color: string;
  emoji: string;
  aspect: "square" | "wide" | "tall";
}

const PHOTOS: Photo[] = [
  { id: "1", label: "Sunrise at Stanley Park", date: "Mar 22, 2026", starred: true, color: "from-orange-300 via-rose-300 to-pink-400", emoji: "🌅", aspect: "wide" },
  { id: "2", label: "Hiking trail", date: "Mar 22, 2026", starred: false, color: "from-green-400 to-emerald-600", emoji: "🌲", aspect: "square" },
  { id: "3", label: "City skyline", date: "Mar 21, 2026", starred: false, color: "from-slate-400 to-blue-600", emoji: "🏙️", aspect: "square" },
  { id: "4", label: "Mountain view", date: "Mar 20, 2026", starred: true, color: "from-sky-300 to-indigo-500", emoji: "⛰️", aspect: "tall" },
  { id: "5", label: "Dinner with friends", date: "Mar 18, 2026", starred: false, color: "from-amber-300 to-yellow-500", emoji: "🍜", aspect: "square" },
  { id: "6", label: "Coffee morning", date: "Mar 17, 2026", starred: false, color: "from-brown-300 to-amber-700", emoji: "☕", aspect: "square" },
  { id: "7", label: "Beach walk", date: "Mar 15, 2026", starred: true, color: "from-cyan-300 to-blue-400", emoji: "🏖️", aspect: "wide" },
  { id: "8", label: "Market day", date: "Mar 14, 2026", starred: false, color: "from-red-300 to-rose-500", emoji: "🥦", aspect: "square" },
  { id: "9", label: "Night lights", date: "Mar 12, 2026", starred: false, color: "from-purple-600 to-indigo-800", emoji: "✨", aspect: "square" },
  { id: "10", label: "Pet photo", date: "Mar 10, 2026", starred: true, color: "from-amber-200 to-orange-300", emoji: "🐶", aspect: "square" },
  { id: "11", label: "Sunset drive", date: "Mar 8, 2026", starred: false, color: "from-orange-400 to-red-500", emoji: "🌇", aspect: "wide" },
  { id: "12", label: "Garden", date: "Mar 5, 2026", starred: false, color: "from-green-300 to-lime-500", emoji: "🌸", aspect: "square" },
];

function PhotoCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-200"
      style={{ gridRow: photo.aspect === "tall" ? "span 2" : "span 1", gridColumn: photo.aspect === "wide" ? "span 2" : "span 1" }}
      onClick={onClick}
    >
      <div className={`w-full h-full min-h-[160px] bg-gradient-to-br ${photo.color} flex items-center justify-center`}>
        <span className="text-5xl select-none">{photo.emoji}</span>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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

export default function MPhotos() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "albums">("grid");
  const [selected, setSelected] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = PHOTOS.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase())
  );

  const openPhoto = (photo: Photo) => {
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
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-md">
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Mphotos</span>
          </div>
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
          <Button className="gap-2 rounded-full ml-2">
            <Plus className="h-4 w-4" />
            Upload
          </Button>
          <Avatar className="h-9 w-9 border border-border/50 shadow-sm ml-1">
            <AvatarImage src={`${import.meta.env.BASE_URL}images/avatar.png`} alt="Mavandeep" className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">M</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {view === "albums" ? (
          <div className="max-w-5xl mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {ALBUMS.map((album) => (
                <div
                  key={album.id}
                  className="group cursor-pointer"
                  onClick={() => setView("grid")}
                >
                  <div className={`aspect-square rounded-2xl bg-gradient-to-br ${album.color} flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]`}>
                    <span className="text-5xl">{album.emoji}</span>
                  </div>
                  <p className="mt-2 font-semibold text-sm truncate">{album.name}</p>
                  <p className="text-xs text-muted-foreground">{album.count} items</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Photos</h2>
              <Badge variant="secondary" className="rounded-full">{filtered.length} photos</Badge>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
                <ImageIcon className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">No photos found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(4, 1fr)", gridAutoRows: "160px" }}
              >
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
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col" onClick={() => setSelected(null)}>
          {/* Lightbox toolbar */}
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

          {/* Photo display */}
          <div className="flex-1 flex items-center justify-center relative" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 text-white hover:bg-white/10 rounded-full h-12 w-12 z-10"
              onClick={prevPhoto}
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>

            <div className={`w-[420px] h-[420px] rounded-3xl bg-gradient-to-br ${selected.color} flex items-center justify-center shadow-2xl`}>
              <span className="text-9xl select-none">{selected.emoji}</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 text-white hover:bg-white/10 rounded-full h-12 w-12 z-10"
              onClick={nextPhoto}
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
          </div>

          {/* Filmstrip */}
          <div className="flex items-center justify-center gap-2 px-6 py-4 overflow-x-auto" onClick={(e) => e.stopPropagation()}>
            {filtered.map((p, i) => (
              <div
                key={p.id}
                onClick={() => { setSelected(p); setSelectedIndex(i); }}
                className={`flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center cursor-pointer transition-all ${i === selectedIndex ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"}`}
              >
                <span className="text-xl">{p.emoji}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
