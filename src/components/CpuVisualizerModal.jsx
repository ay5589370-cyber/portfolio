import React, { useState, useMemo } from 'react';
import { X, Plus, Trash2, Cpu, BarChart3, Clock, Play, RotateCcw } from 'lucide-react';

export default function CpuVisualizerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [algorithm, setAlgorithm] = useState('FCFS');
  const [quantum, setQuantum] = useState(2);
  const [processes, setProcesses] = useState([
    { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 2 },
    { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 9, priority: 3 },
    { id: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 },
    { id: 'P5', arrivalTime: 4, burstTime: 2, priority: 1 }
  ]);

  const addProcess = () => {
    const nextId = `P${processes.length + 1}`;
    setProcesses([
      ...processes,
      { id: nextId, arrivalTime: processes.length, burstTime: 4, priority: 2 }
    ]);
  };

  const removeProcess = (index) => {
    if (processes.length <= 1) return;
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const updateProcess = (index, field, value) => {
    const numVal = Math.max(0, parseInt(value) || 0);
    const updated = [...processes];
    updated[index] = { ...updated[index], [field]: numVal };
    setProcesses(updated);
  };

  // Algorithm Simulation Engine
  const simulationResult = useMemo(() => {
    if (processes.length === 0) return { gantt: [], metrics: [], avgWT: 0, avgTAT: 0, avgRT: 0, cpuUtil: 0, throughput: 0 };

    let gantt = [];
    let metricsMap = {};
    processes.forEach(p => {
      metricsMap[p.id] = {
        id: p.id,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        priority: p.priority,
        startTime: -1,
        completionTime: 0,
        waitingTime: 0,
        turnaroundTime: 0,
        responseTime: 0
      };
    });

    const procs = processes.map(p => ({ ...p, remainingTime: p.burstTime }));

    if (algorithm === 'FCFS') {
      let sorted = [...procs].sort((a, b) => a.arrivalTime - b.arrivalTime);
      let currentTime = 0;

      for (let p of sorted) {
        if (currentTime < p.arrivalTime) {
          gantt.push({ id: 'IDLE', start: currentTime, end: p.arrivalTime });
          currentTime = p.arrivalTime;
        }
        const start = currentTime;
        const end = currentTime + p.burstTime;
        gantt.push({ id: p.id, start, end });
        metricsMap[p.id].startTime = start;
        metricsMap[p.id].completionTime = end;
        currentTime = end;
      }
    } else if (algorithm === 'SJF') {
      let currentTime = 0;
      let completed = 0;
      let isCompleted = new Array(procs.length).fill(false);

      while (completed < procs.length) {
        let idx = -1;
        let minBurst = Infinity;

        for (let i = 0; i < procs.length; i++) {
          if (procs[i].arrivalTime <= currentTime && !isCompleted[i]) {
            if (procs[i].burstTime < minBurst) {
              minBurst = procs[i].burstTime;
              idx = i;
            }
          }
        }

        if (idx !== -1) {
          const p = procs[idx];
          const start = currentTime;
          const end = currentTime + p.burstTime;
          gantt.push({ id: p.id, start, end });
          metricsMap[p.id].startTime = start;
          metricsMap[p.id].completionTime = end;
          currentTime = end;
          isCompleted[idx] = true;
          completed++;
        } else {
          const nextArrival = Math.min(...procs.filter((_, i) => !isCompleted[i]).map(p => p.arrivalTime));
          gantt.push({ id: 'IDLE', start: currentTime, end: nextArrival });
          currentTime = nextArrival;
        }
      }
    } else if (algorithm === 'Priority') {
      let currentTime = 0;
      let completed = 0;
      let isCompleted = new Array(procs.length).fill(false);

      while (completed < procs.length) {
        let idx = -1;
        let minPriority = Infinity;

        for (let i = 0; i < procs.length; i++) {
          if (procs[i].arrivalTime <= currentTime && !isCompleted[i]) {
            if (procs[i].priority < minPriority) {
              minPriority = procs[i].priority;
              idx = i;
            }
          }
        }

        if (idx !== -1) {
          const p = procs[idx];
          const start = currentTime;
          const end = currentTime + p.burstTime;
          gantt.push({ id: p.id, start, end });
          metricsMap[p.id].startTime = start;
          metricsMap[p.id].completionTime = end;
          currentTime = end;
          isCompleted[idx] = true;
          completed++;
        } else {
          const nextArrival = Math.min(...procs.filter((_, i) => !isCompleted[i]).map(p => p.arrivalTime));
          gantt.push({ id: 'IDLE', start: currentTime, end: nextArrival });
          currentTime = nextArrival;
        }
      }
    } else if (algorithm === 'SRTF') {
      let currentTime = 0;
      let completed = 0;
      let n = procs.length;
      let isCompleted = new Array(n).fill(false);

      while (completed < n) {
        let idx = -1;
        let minRem = Infinity;

        for (let i = 0; i < n; i++) {
          if (procs[i].arrivalTime <= currentTime && !isCompleted[i]) {
            if (procs[i].remainingTime < minRem && procs[i].remainingTime > 0) {
              minRem = procs[i].remainingTime;
              idx = i;
            }
          }
        }

        if (idx !== -1) {
          if (metricsMap[procs[idx].id].startTime === -1) {
            metricsMap[procs[idx].id].startTime = currentTime;
          }

          const pId = procs[idx].id;
          if (gantt.length > 0 && gantt[gantt.length - 1].id === pId) {
            gantt[gantt.length - 1].end += 1;
          } else {
            gantt.push({ id: pId, start: currentTime, end: currentTime + 1 });
          }

          procs[idx].remainingTime -= 1;
          currentTime += 1;

          if (procs[idx].remainingTime === 0) {
            metricsMap[pId].completionTime = currentTime;
            isCompleted[idx] = true;
            completed++;
          }
        } else {
          if (gantt.length > 0 && gantt[gantt.length - 1].id === 'IDLE') {
            gantt[gantt.length - 1].end += 1;
          } else {
            gantt.push({ id: 'IDLE', start: currentTime, end: currentTime + 1 });
          }
          currentTime += 1;
        }
      }
    } else if (algorithm === 'Round Robin') {
      let currentTime = 0;
      let queue = [];
      let visited = new Array(procs.length).fill(false);
      let remaining = procs.map(p => p.burstTime);
      let q = Math.max(1, quantum);

      let sorted = procs.map((p, idx) => ({ ...p, idx })).sort((a, b) => a.arrivalTime - b.arrivalTime);
      currentTime = sorted[0]?.arrivalTime || 0;

      sorted.forEach(p => {
        if (p.arrivalTime <= currentTime && !visited[p.idx]) {
          queue.push(p.idx);
          visited[p.idx] = true;
        }
      });

      let completed = 0;
      while (completed < procs.length) {
        if (queue.length === 0) {
          let unvisited = sorted.filter(p => !visited[p.idx]);
          if (unvisited.length > 0) {
            currentTime = unvisited[0].arrivalTime;
            sorted.forEach(p => {
              if (p.arrivalTime <= currentTime && !visited[p.idx]) {
                queue.push(p.idx);
                visited[p.idx] = true;
              }
            });
          } else {
            break;
          }
        }

        const idx = queue.shift();
        const p = procs[idx];

        if (metricsMap[p.id].startTime === -1) {
          metricsMap[p.id].startTime = currentTime;
        }

        const execTime = Math.min(q, remaining[idx]);
        const start = currentTime;
        const end = currentTime + execTime;

        gantt.push({ id: p.id, start, end });
        remaining[idx] -= execTime;
        currentTime = end;

        sorted.forEach(sp => {
          if (sp.arrivalTime <= currentTime && !visited[sp.idx]) {
            queue.push(sp.idx);
            visited[sp.idx] = true;
          }
        });

        if (remaining[idx] > 0) {
          queue.push(idx);
        } else {
          metricsMap[p.id].completionTime = currentTime;
          completed++;
        }
      }
    }

    let totalWT = 0, totalTAT = 0, totalRT = 0, totalBurst = 0;
    const metricsList = Object.values(metricsMap).map(m => {
      const tat = m.completionTime - m.arrivalTime;
      const wt = tat - m.burstTime;
      const rt = m.startTime - m.arrivalTime;
      totalWT += wt;
      totalTAT += tat;
      totalRT += rt;
      totalBurst += m.burstTime;
      return {
        ...m,
        turnaroundTime: tat,
        waitingTime: wt,
        responseTime: rt
      };
    });

    const count = metricsList.length || 1;
    const totalDuration = gantt.length > 0 ? gantt[gantt.length - 1].end : 1;
    const cpuUtil = ((totalBurst / totalDuration) * 100).toFixed(2);
    const throughput = (count / totalDuration).toFixed(3);

    return {
      gantt,
      metrics: metricsList,
      avgWT: (totalWT / count).toFixed(2),
      avgTAT: (totalTAT / count).toFixed(2),
      avgRT: (totalRT / count).toFixed(2),
      cpuUtil,
      throughput
    };
  }, [processes, algorithm, quantum]);

  const getColorForProcess = (id) => {
    if (id === 'IDLE') return 'var(--card-bg)';
    const colors = [
      'var(--accent-primary)',
      'var(--accent-secondary)',
      'var(--accent-success)',
      'var(--accent-primary-hover)',
      'var(--text-secondary)',
      'var(--text-primary)'
    ];
    const num = parseInt(id.replace('P', '')) || 1;
    return colors[(num - 1) % colors.length];
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in">
      <div className="glass-panel w-full max-w-5xl max-h-[94dvh] md:max-h-[92vh] overflow-y-auto p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-primary/25 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary/10 pb-4 sm:pb-6 mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-primary-container/20 text-primary border border-primary/30 flex-shrink-0">
              <Cpu className="size-5 sm:size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-on-surface">CPU Scheduling Visualizer</h3>
              <p className="text-xs md:text-sm text-on-surface-variant font-mono-label">
                Visualize. Analyze. Optimize. Interactive OS Simulator
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-high flex-shrink-0"
          >
            <X className="size-5 sm:size-6" />
          </button>
        </div>

        {/* Algorithm Selection Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
          {[
            { id: 'FCFS', label: 'FCFS', sub: 'First Come First Serve' },
            { id: 'SJF', label: 'SJF', sub: 'Shortest Job First' },
            { id: 'Priority', label: 'Priority', sub: 'Priority Scheduling' },
            { id: 'Round Robin', label: 'Round Robin', sub: 'Time Quantum Based' }
          ].map((alg) => (
            <button
              key={alg.id}
              onClick={() => setAlgorithm(alg.id)}
              className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all ${
                algorithm === alg.id
                  ? 'bg-primary-container/30 border-primary text-on-surface shadow-lg'
                  : 'bg-surface-container/60 border-outline-variant/20 text-on-surface-variant hover:border-primary/40'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm text-on-surface">{alg.label}</div>
              <div className="text-[10px] sm:text-[11px] text-on-surface-variant font-mono-label mt-0.5">{alg.sub}</div>
            </button>
          ))}
        </div>

        {/* Quantum Input if Round Robin */}
        {algorithm === 'Round Robin' && (
          <div className="mb-5 sm:mb-6 flex items-center gap-3 p-3 sm:p-3.5 bg-surface-container-high/60 rounded-xl border border-outline-variant/20">
            <span className="text-xs font-mono-label text-secondary uppercase">Time Quantum (RR):</span>
            <input
              type="number"
              min="1"
              value={quantum}
              onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-1 bg-surface-container border border-outline-variant/40 rounded-lg text-on-surface text-sm font-mono-label outline-none"
            />
          </div>
        )}

        {/* Process Queue Input Table */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-mono-label uppercase tracking-wider text-secondary flex items-center gap-2">
              Process Queue
            </h4>
            <button
              onClick={addProcess}
              className="px-3 py-1.5 glass-panel text-xs font-mono-label text-primary hover:text-on-surface rounded-full flex items-center gap-1.5 transition-colors border border-primary/20"
            >
              <Plus size={14} /> Add Process
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-surface-container/40">
            <table className="w-full min-w-[34rem] text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 text-on-surface-variant font-mono-label uppercase">
                  <th className="p-3">ID</th>
                  <th className="p-3">Burst Time</th>
                  <th className="p-3">Arrival Time</th>
                  {algorithm === 'Priority' && <th className="p-3">Priority</th>}
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {processes.map((p, index) => (
                  <tr key={p.id} className="hover:bg-surface-container-high/30">
                    <td className="p-3 font-bold font-mono-label" style={{ color: getColorForProcess(p.id) }}>
                      {p.id}
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        value={p.burstTime}
                        onChange={(e) => updateProcess(index, 'burstTime', e.target.value)}
                        className="w-16 px-2 py-1 bg-surface-container border border-outline-variant/30 rounded text-on-surface font-mono-label"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        value={p.arrivalTime}
                        onChange={(e) => updateProcess(index, 'arrivalTime', e.target.value)}
                        className="w-16 px-2 py-1 bg-surface-container border border-outline-variant/30 rounded text-on-surface font-mono-label"
                      />
                    </td>
                    {algorithm === 'Priority' && (
                      <td className="p-3">
                        <input
                          type="number"
                          min="1"
                          value={p.priority}
                          onChange={(e) => updateProcess(index, 'priority', e.target.value)}
                          className="w-16 px-2 py-1 bg-surface-container border border-outline-variant/30 rounded text-on-surface font-mono-label"
                        />
                      </td>
                    )}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => removeProcess(index)}
                        className="text-error p-1"
                        title="Remove Process"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Gantt Chart Timeline */}
        <div className="mb-6 sm:mb-8">
          <h4 className="text-sm font-mono-label uppercase tracking-wider text-secondary mb-3 flex items-center gap-2">
            <BarChart3 size={16} /> Gantt Chart Timeline
          </h4>
          <div className="p-3 sm:p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/20">
            <div className="flex h-12 rounded-xl overflow-hidden border border-primary/20">
              {simulationResult.gantt.map((g, idx) => {
                const duration = g.end - g.start;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center text-xs font-bold text-on-primary transition-all hover:opacity-90 relative border-r border-black/20"
                    style={{ flex: duration, backgroundColor: getColorForProcess(g.id) }}
                    title={`${g.id}: ${g.start} → ${g.end}`}
                  >
                    {g.id}
                  </div>
                );
              })}
            </div>
            {/* Markers */}
            <div className="flex justify-between text-[11px] font-mono-label text-on-surface-variant mt-2 px-1">
              {simulationResult.gantt.map((g, idx) => (
                <span key={idx}>{g.start}</span>
              ))}
              <span>{simulationResult.gantt[simulationResult.gantt.length - 1]?.end || 0}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/20">
            <div className="text-xs font-mono-label text-on-surface-variant">Average Waiting Time</div>
            <div className="text-xl sm:text-2xl font-bold text-primary font-display-xl mt-1">{simulationResult.avgWT} ms</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/20">
            <div className="text-xs font-mono-label text-on-surface-variant">Average Turnaround Time</div>
            <div className="text-xl sm:text-2xl font-bold text-secondary font-display-xl mt-1">{simulationResult.avgTAT} ms</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/20">
            <div className="text-xs font-mono-label text-on-surface-variant">CPU Utilization</div>
            <div className="text-xl sm:text-2xl font-bold text-secondary font-display-xl mt-1">{simulationResult.cpuUtil}%</div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-surface-container-high/60 border border-outline-variant/20">
            <div className="text-xs font-mono-label text-on-surface-variant">Throughput</div>
            <div className="text-xl sm:text-2xl font-bold text-primary font-display-xl mt-1">{simulationResult.throughput} p/ms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
