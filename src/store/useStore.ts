import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnterpriseData } from '../types';

interface AppState extends EnterpriseData {
  selectedNoteId: string | null;
  viewMode: 'editor' | 'graph';
  
  // Actions
  setViewMode: (mode: 'editor' | 'graph') => void;
  addCustomer: (name: string) => void;
  addProject: (customerId: string, name: string) => void;
  addWorkstream: (projectId: string, name: string) => void;
  addNote: (workstreamId: string, title: string) => void;
  
  updateNoteContent: (noteId: string, content: string) => void;
  setSelectedNoteId: (id: string | null) => void;
  linkNotes: (noteId1: string, noteId2: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      customers: [],
      projects: [],
      workstreams: [],
      notes: [],
      selectedNoteId: null,
      viewMode: 'editor',

      setViewMode: (viewMode) => set({ viewMode }),

      addCustomer: (name) => set((state) => ({
        customers: [...state.customers, { id: crypto.randomUUID(), name }]
      })),

      addProject: (customerId, name) => set((state) => ({
        projects: [...state.projects, { id: crypto.randomUUID(), name, customerId }]
      })),

      addWorkstream: (projectId, name) => set((state) => ({
        workstreams: [...state.workstreams, { id: crypto.randomUUID(), name, projectId }]
      })),

      addNote: (workstreamId, title) => set((state) => {
        const id = crypto.randomUUID();
        return {
          notes: [...state.notes, {
            id,
            title,
            content: '',
            lastModified: Date.now(),
            workstreamId,
            links: []
          }],
          selectedNoteId: id
        };
      }),

      updateNoteContent: (noteId, content) => set((state) => ({
        notes: state.notes.map(n => n.id === noteId ? { ...n, content, lastModified: Date.now() } : n)
      })),

      setSelectedNoteId: (id) => set({ selectedNoteId: id }),

      linkNotes: (id1, id2) => set((state) => ({
        notes: state.notes.map(n => {
          if (n.id === id1 && !n.links.includes(id2)) return { ...n, links: [...n.links, id2] };
          if (n.id === id2 && !n.links.includes(id1)) return { ...n, links: [...n.links, id1] };
          return n;
        })
      }))
    }),
    {
      name: 'enterprise-notes-storage',
    }
  )
);
