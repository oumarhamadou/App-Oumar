"use client";

import { create } from "zustand";

interface UiState {
  paletteOpen: boolean;
  notificationsOpen: boolean;
  menuOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
}

/** Ephemeral UI state shared across the shell (not persisted). */
export const useUiStore = create<UiState>()((set) => ({
  paletteOpen: false,
  notificationsOpen: false,
  menuOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen, notificationsOpen: false, menuOpen: false }),
  setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen, paletteOpen: false }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
