"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Search, X, Mic, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { formatPrice, api, type Product } from "@/lib/api";
import { useSearchStore } from "@/lib/store";

const POPULAR_SEARCHES = ["Diamond", "Emerald", "Solitaire", "Gold", "Sapphire"];

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const setIsSearching = useSearchStore((s) => s.setIsSearching);

  const urlQuery = searchParams.get("search") || "";
  const [searchText, setSearchText] = useState(urlQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Sync isPending to the global Zustand store to trigger skeletons on ShopPage
  useEffect(() => {
    setIsSearching(isPending);
  }, [isPending, setIsSearching]);

  // Synchronize local input value when URL/parent query changes
  useEffect(() => {
    setSearchText(urlQuery);
  }, [urlQuery]);

  // Fetch trending products client-side on mount
  useEffect(() => {
    api.products({ featured: true, limit: 3 })
      .then((res) => {
        setTrendingProducts(res.items || []);
      })
      .catch((err) => {
        console.error("Failed to fetch trending products for search dropdown:", err);
      });
  }, []);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset pagination

    if (pathname === "/shop") {
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    } else {
      router.push(`/shop?${params.toString()}`);
    }
  };

  // Debounced search text update (400ms)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (searchText !== urlQuery) {
        handleSearch(searchText);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFocused(false);
        (document.activeElement as HTMLElement)?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = () => {
    setSearchText("");
    handleSearch("");
    setIsFocused(false);
  };

  const handleInstantSearch = (term: string) => {
    setSearchText(term);
    handleSearch(term);
    setIsFocused(false);
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice search is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        toast.info("Listening... Speak now", { id: "voice-search-status", duration: 10000 });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          toast.dismiss("voice-search-status");
          toast.success(`Search for: "${transcript}"`);
          handleInstantSearch(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        toast.dismiss("voice-search-status");
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          toast.error("Microphone access denied. Please enable permissions in your browser.");
        } else if (event.error === "no-speech") {
          toast.warning("No speech detected. Please try again.");
        } else {
          toast.error(`Voice search error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to initialize speech recognition:", err);
      setIsListening(false);
    }
  };

  return (
    <div className="relative w-full max-w-full z-40" ref={containerRef} data-testid="search-container">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-5 text-gold pointer-events-none">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={isListening ? "Listening... Speak now" : "Search for diamond jewellery..."}
          className={`w-full bg-cream/45 hover:bg-cream/70 focus:bg-cream/90 border rounded-full py-2.5 pl-11 pr-20 text-[12px] tracking-wide text-onyx placeholder-onyx/40 transition-all outline-none ${
            isFocused ? "border-gold ring-1 ring-gold shadow-gold" : "border-gold/20 hover:border-gold/40"
          }`}
          data-testid="search-input"
        />
        <div className="absolute right-4 flex items-center gap-2.5">
          {searchText && (
            <button
              onClick={handleClear}
              className="text-onyx/40 hover:text-onyx transition-colors p-1"
              aria-label="Clear search"
              data-testid="search-clear"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={startVoiceSearch}
            className={`p-1.5 rounded-full transition-all ${
              isListening ? "bg-gold text-onyx animate-pulse scale-110" : "text-onyx/50 hover:text-gold hover:scale-105"
            }`}
            aria-label="Voice search"
            title="Search by voice"
            data-testid="voice-search-btn"
          >
            <Mic size={14} />
          </button>
        </div>
      </div>

      {/* Popover Dropdown (Visible on focus) */}
      {isFocused && (
        <div
          className="absolute left-0 right-0 mt-2 bg-ivory/95 border border-gold/20 shadow-luxury rounded-2xl p-5 md:p-6 backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-300"
          data-testid="search-dropdown"
        >
          {/* Popular Searches */}
          <div>
            <h4 className="text-[9px] tracking-[0.2em] uppercase text-gold font-medium mb-2.5">Popular Searches</h4>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleInstantSearch(tag)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-cream/40 border border-gold/15 rounded-full text-[11px] text-onyx/80 hover:bg-gold/10 hover:border-gold hover:text-onyx transition cursor-pointer"
                  data-testid={`popular-search-${tag.toLowerCase()}`}
                >
                  <ArrowUpRight size={11} className="text-gold" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Products */}
          {trendingProducts.length > 0 && (
            <div className="mt-6 border-t border-gold/10 pt-5">
              <h4 className="text-[9px] tracking-[0.2em] uppercase text-gold font-medium mb-3">Trending Products</h4>
              <div className="grid grid-cols-3 gap-3">
                {trendingProducts.map((p) => {
                  const price = p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
                  return (
                    <Link
                      key={p._id}
                      href={`/product/${p.slug}`}
                      onClick={() => setIsFocused(false)}
                      className="group block"
                      data-testid={`trending-product-${p.slug}`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-cream border border-gold/5 rounded-lg">
                        {p.images[0] && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                          />
                        )}
                      </div>
                      <p className="mt-1.5 text-[10px] font-medium text-onyx truncate group-hover:text-emerald transition-colors">
                        {p.name}
                      </p>
                      <p className="text-[9px] text-onyx/60 font-light mt-0.5">
                        {formatPrice(price, p.currency)}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
