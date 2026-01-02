
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_BURP_HISTORY } from '../../constants';
import { Play, Square, RotateCcw, Send, Trash2, AlertTriangle, Search, Filter, Settings, Info, CheckCircle, XCircle, Activity } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface IntruderResult {
    id: number;
    payload: string;
    status: number;
    length: number;
    time: number;
}

const BurpSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Proxy');
  const [selectedReq, setSelectedReq] = useState<number | null>(null);
  const { isLightMode } = useTheme();

  // Repeater State
  const [repeaterReq, setRepeaterReq] = useState(`POST /api/login HTTP/1.1
Host: target-system.local
Content-Type: application/json
Content-Length: 45

{"username": "§admin§", "password": "§password§"}`);
  const [repeaterRes, setRepeaterRes] = useState('');
  const [repeaterLoading, setRepeaterLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number>(0);

  // Intruder State
  const [intruderRunning, setIntruderRunning] = useState(false);
  const [intruderResults, setIntruderResults] = useState<IntruderResult[]>([]);
  const [intruderProgress, setIntruderProgress] = useState(0);
  const intruderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tabs = ['Dashboard', 'Target', 'Proxy', 'Intruder', 'Repeater', 'Sequencer', 'Decoder'];

  // Cleanup intruder on unmount
  useEffect(() => {
      return () => {
          if (intruderTimerRef.current) clearInterval(intruderTimerRef.current);
      };
  }, []);

  // --- THEME CONFIGURATION ---
  const theme = {
      bg: isLightMode ? 'bg-[#e0e0e0]' : 'bg-[#121212]',
      text: isLightMode ? 'text-black' : 'text-[#cccccc]',
      textSec: isLightMode ? 'text-gray-600' : 'text-gray-400',
      border: isLightMode ? 'border-gray-400' : 'border-[#333333]',
      panelBg: isLightMode ? 'bg-white' : 'bg-[#1e1e1e]',
      headerBg: isLightMode ? 'bg-[#f0f0f0]' : 'bg-[#252526]',
      tabBarBg: isLightMode ? 'bg-[#ff6633]' : 'bg-[#1e1e1e]', // Classic Orange vs Dark
      tabActive: isLightMode ? 'bg-white text-black' : 'bg-[#333] text-[#ff6633] border-t-2 border-[#ff6633]',
      tabInactive: isLightMode ? 'bg-[#e65c00] text-white hover:bg-[#ff8533]' : 'bg-[#1e1e1e] text-gray-400 hover:text-white',
      tableHeader: isLightMode ? 'bg-gray-100' : 'bg-[#252526] text-gray-300',
      tableRow: isLightMode ? 'hover:bg-blue-100' : 'hover:bg-[#2a2d3e]',
      tableRowSelected: isLightMode ? 'bg-blue-200' : 'bg-[#0d293e] text-white',
      inputBg: isLightMode ? 'bg-white border-gray-300' : 'bg-[#121212] border-[#333] text-gray-200',
      codeBg: isLightMode ? 'bg-white' : 'bg-[#121212]',
      buttonPrimary: 'bg-[#ff6633] hover:bg-[#e65c00] text-white',
      buttonSecondary: isLightMode ? 'bg-gray-200 hover:bg-gray-300 text-black' : 'bg-[#333] hover:bg-[#444] text-white',
  };

  const handleRepeaterSend = () => {
      setRepeaterLoading(true);
      setRepeaterRes(''); 
      const startT = performance.now();
      
      setTimeout(() => {
          let responseBody = "Invalid credentials";
          let status = 401;
          
          if (repeaterReq.includes('admin') && (repeaterReq.includes("123456") || repeaterReq.includes("' OR '1'='1"))) {
              status = 200;
              responseBody = '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "role": "admin"}';
          } else if (repeaterReq.includes("GET /")) {
              status = 200;
              responseBody = "<html><body><h1>Vulnerable App</h1><p>Welcome to the dashboard.</p></body></html>";
          }

          const response = `HTTP/1.1 ${status} ${status === 200 ? 'OK' : 'Unauthorized'}
Date: ${new Date().toUTCString()}
Server: Apache/2.4.41 (Ubuntu)
Content-Type: application/json
Content-Length: ${responseBody.length}
Connection: keep-alive
X-Powered-By: PHP/7.4.3

${responseBody}`;
          
          setRepeaterRes(response);
          setResponseStatus(status);
          setResponseTime(Math.round(performance.now() - startT));
          setRepeaterLoading(false);
      }, 600);
  };

  const toggleIntruder = () => {
      if (intruderRunning) {
          setIntruderRunning(false);
          if (intruderTimerRef.current) clearInterval(intruderTimerRef.current);
      } else {
          setIntruderRunning(true);
          setIntruderResults([]);
          setIntruderProgress(0);
          let id = 0;
          const payloads = ['admin', 'test', 'guest', 'root', 'user', '123456', 'password', 'welcome', '12345', 'qwerty'];
          const total = payloads.length * 3; 
          
          intruderTimerRef.current = setInterval(() => {
              id++;
              const payloadIndex = id % payloads.length;
              const payload = payloads[payloadIndex] + (Math.floor(Math.random() * 100));
              const isLucky = Math.random() > 0.95;
              
              setIntruderResults(prev => [...prev, {
                  id,
                  payload,
                  status: isLucky ? 200 : 403,
                  length: isLucky ? 1540 : 302 + Math.floor(Math.random() * 20),
                  time: Math.floor(Math.random() * 100) + 20
              }]);

              setIntruderProgress((prev) => Math.min(100, prev + (100 / total)));

              if (id >= total) {
                  setIntruderRunning(false);
                  if (intruderTimerRef.current) clearInterval(intruderTimerRef.current);
              }
          }, 200);
      }
  };

  return (
    <div className={`h-full flex flex-col ${theme.bg} ${theme.text} font-sans text-xs transition-colors duration-300`}>
      {/* Menu Bar */}
      <div className={`${theme.headerBg} border-b ${theme.border} p-1 flex space-x-4 select-none`}>
        {['Burp', 'Project', 'Intruder', 'Repeater', 'Window', 'Help'].map(m => (
            <span key={m} className={`cursor-default px-2 py-0.5 rounded hover:${isLightMode ? 'bg-blue-200' : 'bg-[#3e3e42]'}`}>{m}</span>
        ))}
      </div>

      {/* Tabs */}
      <div className={`${theme.tabBarBg} px-2 pt-1 flex space-x-1 shrink-0`}>
        {tabs.map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-t-sm font-medium transition-colors ${activeTab === tab ? theme.tabActive : theme.tabInactive}`}
            >
                {tab}
            </button>
        ))}
      </div>

      {/* Content Area */}
      <div className={`flex-1 flex flex-col p-2 ${theme.panelBg} overflow-hidden`}>
        
        {/* DASHBOARD TAB */}
        {activeTab === 'Dashboard' && (
            <div className="flex flex-col h-full gap-4 p-2 overflow-y-auto">
                {/* Top Stats */}
                <div className="grid grid-cols-2 gap-4 h-1/2">
                    {/* Tasks */}
                    <div className={`border ${theme.border} rounded p-3 flex flex-col`}>
                        <h3 className={`font-bold mb-2 ${theme.text} flex justify-between`}>
                            Tasks
                            <div className="flex gap-2">
                                <button className={`px-2 py-0.5 text-[10px] rounded ${theme.buttonSecondary}`}>New scan</button>
                                <button className={`px-2 py-0.5 text-[10px] rounded ${theme.buttonSecondary}`}>New live task</button>
                            </div>
                        </h3>
                        <div className={`flex-1 border ${theme.border} ${isLightMode ? 'bg-gray-50' : 'bg-[#121212]'} overflow-auto`}>
                            <div className={`p-2 border-b ${theme.border} flex items-center justify-between`}>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[11px]">Crawl and Audit - 10.0.0.5</span>
                                    <span className="text-[10px] text-green-500">Finished</span>
                                </div>
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-full"></div>
                                </div>
                            </div>
                            <div className={`p-2 border-b ${theme.border} flex items-center justify-between`}>
                                <div className="flex flex-col">
                                    <span className="font-bold text-[11px]">Passive Crawl - target-system.local</span>
                                    <span className="text-[10px] text-orange-500">Live capture</span>
                                </div>
                                <Activity size={14} className="text-orange-500 animate-pulse" />
                            </div>
                        </div>
                    </div>

                    {/* Event Log */}
                    <div className={`border ${theme.border} rounded p-3 flex flex-col`}>
                        <h3 className="font-bold mb-2">Event log</h3>
                        <div className={`flex-1 border ${theme.border} ${theme.codeBg} p-2 font-mono text-[10px] overflow-auto`}>
                            <div className="text-blue-500">[Info] Proxy service started on 127.0.0.1:8080</div>
                            <div className="text-blue-500">[Info] Loaded extension: Logger++</div>
                            <div className={isLightMode ? "text-gray-600" : "text-gray-400"}>[Debug] SSL Handshake succeeded for 10.0.0.5</div>
                            <div className="text-orange-500">[Warn] The target is using a self-signed certificate</div>
                        </div>
                    </div>
                </div>

                {/* Issue Activity */}
                <div className={`border ${theme.border} rounded p-3 flex-1 flex flex-col`}>
                    <h3 className="font-bold mb-2">Issue activity</h3>
                    <div className={`flex-1 border ${theme.border} overflow-auto`}>
                        <table className="w-full text-left border-collapse">
                            <thead className={`${theme.tableHeader} sticky top-0`}>
                                <tr>
                                    <th className={`border-b border-r ${theme.border} p-1 w-8`}>Sev</th>
                                    <th className={`border-b border-r ${theme.border} p-1`}>Host</th>
                                    <th className={`border-b ${theme.border} p-1`}>Issue</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={theme.tableRow}>
                                    <td className={`border-b border-r ${theme.border} p-1 bg-red-500 text-white text-center font-bold`}>High</td>
                                    <td className={`border-b border-r ${theme.border} p-1`}>http://10.0.0.5</td>
                                    <td className={`border-b ${theme.border} p-1`}>SQL injection</td>
                                </tr>
                                <tr className={theme.tableRow}>
                                    <td className={`border-b border-r ${theme.border} p-1 bg-orange-500 text-white text-center font-bold`}>Med</td>
                                    <td className={`border-b border-r ${theme.border} p-1`}>http://10.0.0.5</td>
                                    <td className={`border-b ${theme.border} p-1`}>Cross-site scripting (reflected)</td>
                                </tr>
                                <tr className={theme.tableRow}>
                                    <td className={`border-b border-r ${theme.border} p-1 bg-blue-400 text-white text-center font-bold`}>Low</td>
                                    <td className={`border-b border-r ${theme.border} p-1`}>http://10.0.0.5</td>
                                    <td className={`border-b ${theme.border} p-1`}>Password field with autocomplete enabled</td>
                                </tr>
                                 <tr className={theme.tableRow}>
                                    <td className={`border-b border-r ${theme.border} p-1 bg-gray-400 text-white text-center font-bold`}>Info</td>
                                    <td className={`border-b border-r ${theme.border} p-1`}>http://target-system.local</td>
                                    <td className={`border-b ${theme.border} p-1`}>Email addresses disclosed</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* PROXY TAB */}
        {activeTab === 'Proxy' && (
            <div className="flex flex-col h-full">
                <div className={`flex space-x-2 border-b ${theme.border} mb-2 pb-2 shrink-0`}>
                    <button className={`${theme.buttonSecondary} px-3 py-1 rounded border ${theme.border}`}>Intercept is <span className="font-bold">off</span></button>
                    <button className={`${theme.buttonPrimary} px-3 py-1 border border-[#cc5200] rounded font-bold shadow-sm`}>HTTP history</button>
                    <button className={`${theme.buttonSecondary} px-3 py-1 border ${theme.border} rounded`}>WebSockets history</button>
                    <button className={`${theme.buttonSecondary} px-3 py-1 border ${theme.border} rounded`}>Options</button>
                </div>
                
                {/* History Table */}
                <div className={`flex-1 border ${theme.border} overflow-auto ${theme.panelBg} mb-2`}>
                    <table className="w-full text-left border-collapse">
                        <thead className={`${theme.tableHeader} sticky top-0`}>
                            <tr>
                                <th className={`border-r ${theme.border} p-1 w-12`}>#</th>
                                <th className={`border-r ${theme.border} p-1 w-40`}>Host</th>
                                <th className={`border-r ${theme.border} p-1 w-16`}>Method</th>
                                <th className={`border-r ${theme.border} p-1`}>URL</th>
                                <th className={`border-r ${theme.border} p-1 w-20`}>Status</th>
                                <th className={`border-r ${theme.border} p-1 w-20`}>Length</th>
                                <th className={`border-r ${theme.border} p-1 w-20`}>MIME</th>
                            </tr>
                        </thead>
                        <tbody className={theme.text}>
                            {MOCK_BURP_HISTORY.map(req => (
                                <tr 
                                    key={req.id} 
                                    className={`cursor-pointer ${selectedReq === req.id ? theme.tableRowSelected : theme.tableRow}`}
                                    onClick={() => setSelectedReq(req.id)}
                                >
                                    <td className={`border-r ${theme.border} p-1`}>{req.id}</td>
                                    <td className={`border-r ${theme.border} p-1`}>{req.host}</td>
                                    <td className={`border-r ${theme.border} p-1`}>{req.method}</td>
                                    <td className={`border-r ${theme.border} p-1`}>{req.url.substring(0, 40)}</td>
                                    <td className={`border-r ${theme.border} p-1`}>{req.status}</td>
                                    <td className={`border-r ${theme.border} p-1`}>{req.length}</td>
                                    <td className={`border-r ${theme.border} p-1`}>{req.mime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Request/Response Viewer */}
                <div className={`h-1/3 flex border ${theme.border}`}>
                    <div className={`w-1/2 border-r ${theme.border} p-0 flex flex-col`}>
                        <div className={`${theme.headerBg} px-2 py-1 font-bold ${theme.textSec} border-b ${theme.border}`}>Request</div>
                        <div className={`flex-1 p-2 overflow-auto font-mono ${theme.codeBg} ${theme.text}`}>
                        {selectedReq ? (
                            <pre className="text-xs whitespace-pre-wrap">
{`${MOCK_BURP_HISTORY.find(r => r.id === selectedReq)?.method} ${MOCK_BURP_HISTORY.find(r => r.id === selectedReq)?.url} HTTP/1.1
Host: ${MOCK_BURP_HISTORY.find(r => r.id === selectedReq)?.host}
User-Agent: Mozilla/5.0 (X11; Linux x86_64)
Accept: */*
Cookie: session=deadbeef1234
`}
                            </pre>
                        ) : <span className="text-gray-400">Select a request...</span>}
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col">
                        <div className={`${theme.headerBg} px-2 py-1 font-bold ${theme.textSec} border-b ${theme.border}`}>Response</div>
                        <div className={`flex-1 p-2 overflow-auto font-mono ${theme.codeBg} ${theme.text}`}>
                         {selectedReq ? (
                            <pre className="text-xs whitespace-pre-wrap">
{`HTTP/1.1 ${MOCK_BURP_HISTORY.find(r => r.id === selectedReq)?.status} OK
Content-Type: ${MOCK_BURP_HISTORY.find(r => r.id === selectedReq)?.mime}
Content-Length: ${MOCK_BURP_HISTORY.find(r => r.id === selectedReq)?.length}

<html>
  <body>...</body>
</html>`}
                            </pre>
                        ) : null}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* INTRUDER TAB */}
        {activeTab === 'Intruder' && (
            <div className="flex flex-col h-full">
                <div className={`flex justify-between items-center ${theme.headerBg} p-2 border-b ${theme.border} shrink-0`}>
                    <div className="flex items-center gap-4">
                        <div className={`${theme.textSec} font-bold`}>Target: <span className={`font-normal ${theme.text}`}>10.0.0.5:80</span></div>
                        <div className={`${theme.textSec} font-bold`}>Payloads: <span className={`font-normal ${theme.text}`}>Simple list</span></div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={toggleIntruder}
                            className={`px-3 py-1 rounded text-white flex items-center gap-1 font-bold shadow-sm transition-colors ${intruderRunning ? 'bg-red-500 hover:bg-red-600' : theme.buttonPrimary}`}
                        >
                            {intruderRunning ? <><Square size={10} fill="currentColor"/> Stop Attack</> : <><Play size={10} fill="currentColor"/> Start Attack</>}
                        </button>
                    </div>
                </div>

                <div className={`flex-1 border ${theme.border} overflow-auto ${theme.panelBg} mt-2 relative`}>
                    <table className="w-full text-left border-collapse">
                        <thead className={`${theme.tableHeader} sticky top-0`}>
                            <tr>
                                <th className={`border-r ${theme.border} p-1 w-16`}>Req #</th>
                                <th className={`border-r ${theme.border} p-1`}>Payload</th>
                                <th className={`border-r ${theme.border} p-1 w-20`}>Status</th>
                                <th className={`border-r ${theme.border} p-1 w-24`}>Length</th>
                                <th className={`border-r ${theme.border} p-1 w-24`}>Time (ms)</th>
                            </tr>
                        </thead>
                        <tbody className={theme.text}>
                            {intruderResults.length === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400 italic">Configure positions and start attack to see results...</td></tr>
                            )}
                            {intruderResults.map((res, idx) => {
                                let rowClass = theme.tableRow;
                                if (res.status === 200 && res.length > 400) rowClass = isLightMode ? 'bg-green-100' : 'bg-green-900/30';
                                
                                return (
                                    <tr key={idx} className={rowClass}>
                                        <td className={`border-r ${theme.border} p-1`}>{res.id}</td>
                                        <td className={`border-r ${theme.border} p-1 font-mono text-blue-500`}>{res.payload}</td>
                                        <td className={`border-r ${theme.border} p-1`}>{res.status}</td>
                                        <td className={`border-r ${theme.border} p-1`}>{res.length}</td>
                                        <td className={`border-r ${theme.border} p-1`}>{res.time}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                {/* Status Bar */}
                <div className={`h-6 mt-1 border ${theme.border} flex items-center px-2 gap-4 ${isLightMode ? 'bg-gray-100' : 'bg-[#252526]'}`}>
                    <div className="flex-1 h-3 bg-gray-300 rounded-full overflow-hidden border border-gray-400">
                        <div className="h-full bg-orange-500 transition-all duration-200" style={{ width: `${intruderProgress}%` }}></div>
                    </div>
                    <span className="text-[10px] text-gray-500">{Math.round(intruderProgress)}% complete</span>
                </div>
            </div>
        )}

        {/* REPEATER TAB */}
        {activeTab === 'Repeater' && (
            <div className="flex flex-col h-full">
                <div className={`flex space-x-2 ${theme.headerBg} p-2 border-b ${theme.border} mb-2 shrink-0 items-center`}>
                    <button 
                        onClick={handleRepeaterSend}
                        className={`${theme.buttonPrimary} px-4 py-1.5 rounded shadow-sm flex items-center gap-2 font-bold disabled:opacity-50`}
                        disabled={repeaterLoading}
                    >
                        Send <Send size={12} /> 
                    </button>
                    <button className={`${theme.buttonSecondary} px-3 py-1.5 border ${theme.border} rounded shadow-sm flex items-center gap-2`} onClick={() => setRepeaterReq('')}>
                        <Trash2 size={12} /> Clear
                    </button>
                    <div className="flex-1"></div>
                    {responseStatus && (
                        <div className={`px-3 py-1 rounded border flex items-center gap-2 font-mono font-bold ${responseStatus === 200 ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                            <span>{responseStatus}</span>
                            <span className="text-[10px] font-normal opacity-70">{responseTime}ms</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex gap-2 overflow-hidden">
                    {/* Request Pane */}
                    <div className={`flex-1 flex flex-col border ${theme.border} ${theme.panelBg}`}>
                        <div className={`${theme.headerBg} px-3 py-1.5 font-bold ${theme.textSec} border-b ${theme.border} text-[11px] uppercase tracking-wider`}>Request</div>
                        <textarea 
                            className={`flex-1 w-full p-3 font-mono resize-none text-sm outline-none ${theme.inputBg}`}
                            value={repeaterReq}
                            onChange={(e) => setRepeaterReq(e.target.value)}
                            spellCheck={false}
                        />
                    </div>

                    {/* Response Pane */}
                    <div className={`flex-1 flex flex-col border ${theme.border} ${theme.panelBg}`}>
                        <div className={`${theme.headerBg} px-3 py-1.5 font-bold ${theme.textSec} border-b ${theme.border} flex justify-between text-[11px] uppercase tracking-wider`}>
                            <span>Response</span>
                            {repeaterLoading && <span className="text-orange-500 animate-pulse">Waiting...</span>}
                        </div>
                        <textarea 
                            className={`flex-1 w-full p-3 font-mono resize-none text-sm outline-none ${theme.inputBg} ${isLightMode ? 'bg-gray-50' : 'bg-[#151515]'}`}
                            value={repeaterRes}
                            readOnly
                            placeholder="Hit Send to see response..."
                        />
                    </div>
                </div>
            </div>
        )}

        {/* Fallback for other tabs */}
        {['Target', 'Sequencer', 'Decoder'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <AlertTriangle size={48} className="mb-4 opacity-30" />
                <p className="text-lg font-bold">Module Not Loaded</p>
                <p className="text-xs mt-2 opacity-60">This feature is not available in the portfolio simulation.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default BurpSuite;
