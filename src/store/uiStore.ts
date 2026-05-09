import { create } from 'zustand';
import type { ActiveModule, ContextMenuState, NodeFormState, EdgeFormState } from '../types';

interface UIStore {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;

  contextMenu: ContextMenuState;
  showContextMenu: (x: number, y: number, flowX: number, flowY: number) => void;
  hideContextMenu: () => void;

  nodeForm: NodeFormState;
  showNodeForm: (state: Omit<NodeFormState, 'visible'>) => void;
  hideNodeForm: () => void;

  edgeForm: EdgeFormState;
  showEdgeForm: (state: Omit<EdgeFormState, 'visible'>) => void;
  hideEdgeForm: () => void;

  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  selectedEdgeId: string | null;
  setSelectedEdgeId: (id: string | null) => void;

  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeModule: 'canvas',
  setActiveModule: (module) => set({ activeModule: module }),

  contextMenu: { visible: false, x: 0, y: 0, flowX: 0, flowY: 0 },
  showContextMenu: (x, y, flowX, flowY) =>
    set({ contextMenu: { visible: true, x, y, flowX, flowY } }),
  hideContextMenu: () =>
    set({ contextMenu: { visible: false, x: 0, y: 0, flowX: 0, flowY: 0 } }),

  nodeForm: { visible: false, mode: 'add' },
  showNodeForm: (state) => set({ nodeForm: { visible: true, ...state } }),
  hideNodeForm: () => set({ nodeForm: { visible: false, mode: 'add' } }),

  edgeForm: { visible: false },
  showEdgeForm: (state) => set({ edgeForm: { visible: true, ...state } }),
  hideEdgeForm: () => set({ edgeForm: { visible: false } }),

  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  selectedEdgeId: null,
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
