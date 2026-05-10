import React from 'react';
import { useVMStore } from '../../store/vmStore';
import { PRESET_PROFILES } from '../../runtime/profiles';
import { useV86 } from '../../hooks/useV86';
import { Cpu, Monitor, Disc, Network } from 'lucide-react';
import { formatUptime } from '../../utils/format';

export const Sidebar: React.FC<{ v86Info: ReturnType<typeof useV86>, stats: string }> = ({ v86Info, stats }) => {
  const { activeTab, setActiveTab } = useVMStore();
  const { isRunning, hasSaveState, uptime, activeProfile, setActiveProfile } = v86Info;

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profileId = e.target.value;
    const profile = PRESET_PROFILES.find(p => p.id === profileId);
    if (profile) {
      setActiveProfile(profile);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveProfile({
        id: 'custom',
        name: file.name,
        cdromFile: file,
        memorySize: activeProfile.memorySize,
        vgaMemorySize: activeProfile.vgaMemorySize,
      });
    }
  };

  return (
    <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col flex-shrink-0">
      
      <div className="flex border-b border-[#3e3e42] bg-[#2d2d30]">
        <button 
          className={`flex-1 py-1 text-xs px-2 ${activeTab === 'hardware' ? 'bg-[#1e1e1e] border-t-2 border-t-blue-500' : 'text-[#999]'}`}
          onClick={() => setActiveTab('hardware')}
        >
          Hardware
        </button>
        <button 
          className={`flex-1 py-1 text-xs px-2 ${activeTab === 'details' ? 'bg-[#1e1e1e] border-t-2 border-t-blue-500' : 'text-[#999]'}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 text-[11px] font-sans">
        {activeTab === 'hardware' && (
          <div className="space-y-4">
            
            {/* Configuration Block */}
            <div>
              <div className="font-semibold text-slate-300 mb-2 border-b border-[#3e3e42] pb-1 uppercase tracking-wider text-[10px]">VM Configuration</div>
              <div className="grid grid-cols-[80px_1fr] gap-y-2 items-center mb-2">
                <label className="text-slate-400">Profile</label>
                <select
                  value={activeProfile.id}
                  onChange={handleProfileChange}
                  disabled={isRunning}
                  className="bg-[#333333] border border-[#454545] text-slate-200 outline-none p-0.5 rounded-sm disabled:opacity-50"
                >
                  {PRESET_PROFILES.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                <label className="text-slate-400 text-[10px] leading-tight">ISO Image</label>
                {activeProfile.id === 'custom' ? (
                  <input 
                    type="file" 
                    accept=".iso,.img,.img.zip"
                    onChange={handleFileUpload}
                    disabled={isRunning}
                    className="bg-[#333333] border border-[#454545] text-slate-200 p-0.5 rounded-sm w-full file:hidden text-[10px]"
                  />
                ) : (
                  <div className="text-slate-300 truncate" title={activeProfile.name}>{activeProfile.name}</div>
                )}
              </div>
            </div>

            {/* Device List */}
            <div>
              <div className="font-semibold text-slate-300 mb-2 border-b border-[#3e3e42] pb-1 uppercase tracking-wider text-[10px]">Virtual Devices</div>
              <ul className="space-y-2">
                
                <li className="flex items-start gap-2 group">
                  <Cpu size={14} className="mt-0.5 text-slate-400" />
                  <div className="flex-1">
                    <div className="text-slate-300">Memory</div>
                    <select
                      value={activeProfile.memorySize}
                      onChange={(e) => setActiveProfile({...activeProfile, memorySize: Number(e.target.value)})}
                      disabled={isRunning}
                      className="bg-[#333333] border border-[#3e3e42] text-slate-300 p-0.5 w-full outline-none mt-1 group-hover:border-[#555] rounded-sm disabled:opacity-50"
                    >
                      <option value={32}>32 MB</option>
                      <option value={64}>64 MB</option>
                      <option value={128}>128 MB</option>
                      <option value={256}>256 MB</option>
                      <option value={512}>512 MB</option>
                    </select>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <Monitor size={14} className="mt-0.5 text-slate-400" />
                  <div className="flex-1">
                    <div className="text-slate-300">Display</div>
                    <div className="text-slate-500 font-mono text-[10px] mt-0.5">Bochs VBE</div>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <Disc size={14} className="mt-0.5 text-slate-400" />
                  <div className="flex-1">
                    <div className="text-slate-300">CD/DVD (IDE)</div>
                    <div className="text-slate-500 font-mono text-[10px] mt-0.5 truncate max-w-[180px]">{activeProfile.name}</div>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <Network size={14} className="mt-0.5 text-slate-400" />
                  <div className="flex-1">
                    <div className="text-slate-300">Network Adapter</div>
                    <div className="text-slate-500 font-mono text-[10px] mt-0.5">NAT (virtio)</div>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-slate-300 mb-2 border-b border-[#3e3e42] pb-1 uppercase tracking-wider text-[10px]">Real-term Status</div>
              <table className="w-full text-slate-400 font-mono text-[10px]">
                <tbody>
                  <tr>
                    <td className="py-1">State</td>
                    <td className={`py-1 ${isRunning ? 'text-green-400' : 'text-slate-500'}`}>{isRunning ? 'Running' : 'Powered Off'}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Uptime</td>
                    <td className="py-1 text-slate-300">{formatUptime(uptime)}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Save State</td>
                    <td className="py-1 text-slate-300">{hasSaveState ? 'Present' : 'None'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {stats && (
              <div>
                <div className="font-semibold text-slate-300 mb-2 border-b border-[#3e3e42] pb-1 uppercase tracking-wider text-[10px]">Instruction Telemetry</div>
                <div className="bg-[#1e1e1e] border border-[#3e3e42] p-2 text-slate-500 font-mono text-[9px] max-h-48 overflow-y-auto whitespace-pre-wrap rounded-sm break-all">
                  {stats}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
