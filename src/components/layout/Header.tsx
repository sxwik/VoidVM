import React, { useEffect } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useV86 } from '../../hooks/useV86';

const MenuBarItem = ({ label, items, activeMenu, setActiveMenu, id }: { label: string, items: {label: string, action?: () => void, disabled?: boolean, separator?: boolean}[], activeMenu: string | null, setActiveMenu: (id: string | null) => void, id: string }) => {
  const isOpen = activeMenu === id;
  
  return (
    <div className="relative">
      <div 
        className={`px-2 py-0.5 cursor-pointer text-xs ${isOpen ? 'bg-[#3e3e42] text-white' : 'text-slate-300 hover:bg-slate-700'}`}
        onClick={() => setActiveMenu(isOpen ? null : id)}
      >
        {label}
      </div>
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-0 bg-[#2d2d30] border border-[#3e3e42] shadow-lg min-w-[200px] py-1 z-50 flex flex-col"
        >
          {items.map((item, i) => item.separator ? (
            <div key={i} className="h-px bg-[#3e3e42] my-1 w-full shrink-0"></div>
          ) : (
            <div 
              key={i} 
              className={`px-6 py-1 text-xs ${item.disabled ? 'text-slate-500 cursor-default' : 'text-slate-300 hover:bg-[#007acc] hover:text-white cursor-pointer'}`}
              onClick={() => {
                if (!item.disabled && item.action) {
                  item.action();
                  setActiveMenu(null);
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Header: React.FC<{ v86Info: ReturnType<typeof useV86> }> = ({ v86Info }) => {
  const { activeMenu, setActiveMenu } = useSettingsStore();
  const { stopEmulator, destroyEmulator, saveState, isRunning, hasSaveState, goFullscreen, restartEmulator, startEmulator } = v86Info;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.relative')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [setActiveMenu]);

  const handleRestore = () => {
    startEmulator(true);
  };

  return (
    <div className="bg-[#2d2d30] flex items-center px-1 py-0.5 border-b border-[#3e3e42]">
      <MenuBarItem 
        id="file" 
        label="File" 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        items={[
          { label: 'Preferences...', disabled: true },
          { separator: true },
          { label: 'Export Appliance...', disabled: true },
          { label: 'Import Appliance...', disabled: true },
          { separator: true },
          { label: 'Exit', action: () => { stopEmulator(); destroyEmulator(); } }
        ]} 
      />
      <MenuBarItem 
        id="machine" 
        label="Machine" 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        items={[
          { label: 'Settings...', disabled: true },
          { separator: true },
          { label: 'Take Snapshot...', action: saveState, disabled: !isRunning },
          { label: 'Restore Snapshot...', action: handleRestore, disabled: isRunning || !hasSaveState },
          { separator: true },
          { label: 'Pause', action: stopEmulator, disabled: !isRunning },
          { label: 'Reset', action: restartEmulator, disabled: !isRunning },
          { label: 'ACPI Shutdown', action: () => { stopEmulator(); destroyEmulator(); }, disabled: !isRunning }
        ]} 
      />
      <MenuBarItem 
        id="view" 
        label="View" 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        items={[
          { label: 'Fullscreen Mode', action: goFullscreen, disabled: !isRunning },
          { label: 'Scaled Mode', disabled: true },
          { separator: true },
          { label: 'Adjust Window Size', disabled: true }
        ]} 
      />
      <MenuBarItem 
        id="input" 
        label="Input" 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        items={[
          { label: 'Keyboard', disabled: true },
          { label: 'Mouse Integration', disabled: true }
        ]} 
      />
      <MenuBarItem 
        id="devices" 
        label="Devices" 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        items={[
          { label: 'Optical Drives', disabled: true },
          { label: 'Audio', disabled: true },
          { label: 'Network', disabled: true },
          { label: 'USB', disabled: true }
        ]} 
      />
      <MenuBarItem 
        id="help" 
        label="Help" 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        items={[
          { label: 'Contents', disabled: true },
          { label: 'VirtualBox Web Site', disabled: true },
          { separator: true },
          { label: 'About VirtualBox', disabled: true }
        ]} 
      />
    </div>
  );
};
