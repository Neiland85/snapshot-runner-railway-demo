import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface NavigationState {
  activeSection: string;
  breadcrumbs: BreadcrumbItem[];
  isLoading: boolean;
}

interface NavigationContextType {
  state: NavigationState;
  navigateToSection: (section: string, breadcrumbs?: BreadcrumbItem[]) => void;
  setLoading: (loading: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  readonly children: ReactNode;
  readonly initialSection?: string;
}

export function NavigationProvider({ children, initialSection = 'dashboard' }: NavigationProviderProps) {
  const [state, setState] = useState<NavigationState>({
    activeSection: initialSection,
    breadcrumbs: [{ label: 'Dashboard', current: true }],
    isLoading: false,
  });

  const navigateToSection = useCallback((section: string, breadcrumbs?: BreadcrumbItem[]) => {
    console.log('NavigationProvider: Navigating to section', section);
    
    setState(prevState => ({
      ...prevState,
      activeSection: section,
      breadcrumbs: breadcrumbs || [{ label: section, current: true }],
      isLoading: false,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prevState => ({
      ...prevState,
      isLoading: loading,
    }));
  }, []);

  const value = useMemo(() => ({
    state,
    navigateToSection,
    setLoading,
  }), [state, navigateToSection, setLoading]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// Hook para navegación por teclado (patrón V0.dev)
export function useKeyboardNavigation(
  sections: string[],
  activeSection: string,
  onSectionChange: (section: string) => void
) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      const currentIndex = sections.indexOf(activeSection);
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp': {
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
          onSectionChange(sections[prevIndex]);
          break;
        }
        case 'ArrowRight':
        case 'ArrowDown': {
          event.preventDefault();
          const nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
          onSectionChange(sections[nextIndex]);
          break;
        }
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': {
          event.preventDefault();
          const sectionIndex = parseInt(event.key, 10) - 1;
          if (sectionIndex < sections.length) {
            onSectionChange(sections[sectionIndex]);
          }
          break;
        }
        default:
          break;
      }
    }
  }, [sections, activeSection, onSectionChange]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}
