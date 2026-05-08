import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { useSimulationStore } from '../../store/simulationStore';

/* ─── GanttChart ──────────────────────────────────────────────────── *
 *  All D3 logic, scale calculations, zoom/rowHeight state, and
 *  currentTime playhead are preserved exactly.
 *  Improved: richer colours, animated playhead, subtler grid,
 *            styled axis text, and nicer control bar.
 * ─────────────────────────────────────────────────────────────────── */
const GanttChart = () => {
  const svgRef       = useRef();
  const containerRef = useRef();
  const { ganttData, currentTime } = useSimulationStore();
  const [zoom,      setZoom]      = useState(1);
  const [rowHeight, setRowHeight] = useState(60);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const margin = { top: 40, right: 50, bottom: 50, left: 80 };
    const pids   = [...new Set(ganttData.map(d => d.pid))].sort((a, b) => a - b);

    /* ── Dimensions (unchanged logic) ── */
    const maxTime       = Math.max(35, Math.ceil(currentTime));
    const containerW    = containerRef.current.clientWidth;
    const containerH    = containerRef.current.clientHeight;
    const unitWidth     = 50 * zoom;
    const chartWidth    = Math.max(containerW - margin.left - margin.right, maxTime * unitWidth);
    const chartHeight   = Math.max(containerH - margin.top - margin.bottom - 20, pids.length * rowHeight);

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width',  chartWidth  + margin.left + margin.right)
      .attr('height', chartHeight + margin.top  + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    /* ── Scales (unchanged) ── */
    const xScale = d3.scaleLinear().domain([0, maxTime]).range([0, chartWidth]);
    const yScale = d3
      .scaleBand()
      .domain(pids.map(p => `P${p}`))
      .range([0, chartHeight])
      .padding(0.38);

    /* ── Richer neon palette ── */
    const colors = ['#00F0FF', '#C084FC', '#34d399', '#fbbf24', '#fb7185', '#60a5fa', '#f97316'];
    const colorScale = d3.scaleOrdinal(colors);

    /* ── Background grid (subtle) ── */
    const tickValues = d3.range(0, maxTime + 1);

    svg
      .selectAll('.grid-v')
      .data(tickValues)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', 'rgba(255,255,255,0.04)')
      .attr('stroke-width', 1);

    /* ── X Axis ── */
    const xAxis = d3
      .axisBottom(xScale)
      .tickValues(tickValues)
      .tickFormat(d3.format('d'))
      .tickSize(6);

    const gx = svg
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis);

    gx.select('.domain').attr('stroke', 'rgba(255,255,255,0.08)');
    gx.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.12)');
    gx.selectAll('.tick text')
      .attr('fill', '#475569')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('dy', '1.2em');

    /* ── Y Axis ── */
    const gy = svg.append('g').call(d3.axisLeft(yScale).tickSize(0));

    gy.select('.domain').attr('stroke', 'none');
    gy.selectAll('.tick text')
      .attr('fill', '#94a3b8')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .attr('dx', '-0.5em');

    /* ── Process row backgrounds (zebra) ── */
    pids.forEach((pid, i) => {
      svg
        .append('rect')
        .attr('x', 0)
        .attr('y', yScale(`P${pid}`))
        .attr('width', chartWidth)
        .attr('height', yScale.bandwidth() + yScale.step() * yScale.paddingInner())
        .attr('fill', i % 2 === 0 ? 'rgba(255,255,255,0.012)' : 'transparent');
    });

    /* ── Bars (unchanged data binding) ── */
    svg
      .selectAll('.bar')
      .data(ganttData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x',      d => xScale(d.start))
      .attr('y',      d => yScale(`P${d.pid}`))
      .attr('width',  d => {
        const visibleEnd = Math.min(d.end, currentTime);
        return Math.max(0, xScale(visibleEnd) - xScale(d.start));
      })
      .attr('height', yScale.bandwidth())
      .attr('fill',   d => colorScale(d.pid))
      .attr('rx', 6)
      .attr('opacity', 0.88)
      .style('filter', d => `drop-shadow(0 0 8px ${colorScale(d.pid)}55)`);

    /* ── Bar Labels ── */
    svg
      .selectAll('.bar-label')
      .data(ganttData)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => {
        const visibleEnd = Math.min(d.end, currentTime);
        return xScale(d.start) + (xScale(visibleEnd) - xScale(d.start)) / 2;
      })
      .attr('y', d => yScale(`P${d.pid}`) + yScale.bandwidth() / 2 + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#000')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '12px')
      .attr('font-weight', '800')
      .text(d => {
        const visibleEnd = Math.min(d.end, currentTime);
        return (visibleEnd - d.start >= 0.7 ? `P${d.pid}` : '');
      });

    /* ── Current-time playhead ── */
    const playheadX = xScale(currentTime);

    /* Gradient glow below the needle */
    const defs = svg.append('defs');
    const grad = defs
      .append('linearGradient')
      .attr('id', 'playhead-grad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    grad.append('stop').attr('offset', '0%')  .attr('stop-color', '#00F0FF').attr('stop-opacity', 0.35);
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#00F0FF').attr('stop-opacity', 0);

    svg
      .append('rect')
      .attr('x', playheadX - 1)
      .attr('y', 0)
      .attr('width', 2)
      .attr('height', chartHeight)
      .attr('fill', 'url(#playhead-grad)');

    /* Needle line */
    svg
      .append('line')
      .attr('x1', playheadX).attr('x2', playheadX)
      .attr('y1', -12)      .attr('y2', chartHeight)
      .attr('stroke', '#00F0FF')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 0 8px #00F0FF)');

    /* Top diamond handle */
    svg
      .append('polygon')
      .attr('points', `${playheadX},${-22} ${playheadX - 6},${-12} ${playheadX + 6},${-12}`)
      .attr('fill', '#00F0FF')
      .style('filter', 'drop-shadow(0 0 6px #00F0FF)');

    /* Time label above diamond */
    svg
      .append('text')
      .attr('x', playheadX)
      .attr('y', -28)
      .attr('text-anchor', 'middle')
      .attr('fill', '#00F0FF')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .text(`T=${currentTime}`);

  }, [ganttData, currentTime, zoom, rowHeight]);

  /* ── Control bar button helper ── */
  const CtrlBtn = ({ onClick, title, children }) => (
    <button
      onClick={onClick}
      title={title}
      className="p-2 rounded-xl transition-all duration-150 text-slate-500 hover:text-slate-200"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full gap-3">

      {/* ── Controls ── */}
      <div className="flex items-center justify-between px-1 flex-shrink-0">
        <div className="flex items-center gap-3">

          {/* Zoom */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <CtrlBtn onClick={() => setZoom(Math.max(0.5, zoom - 0.5))} title="Zoom out">
              <ZoomOut size={15} />
            </CtrlBtn>
            <span className="min-w-[54px] text-center text-[10px] font-mono font-bold text-slate-500">
              {zoom}× Zoom
            </span>
            <CtrlBtn onClick={() => setZoom(Math.min(5, zoom + 0.5))} title="Zoom in">
              <ZoomIn size={15} />
            </CtrlBtn>
          </div>

          {/* Row scale */}
          <div
            className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <CtrlBtn onClick={() => setRowHeight(Math.max(40, rowHeight - 10))} title="Shrink rows">
              <Minimize2 size={15} />
            </CtrlBtn>
            <span className="min-w-[62px] text-center text-[10px] font-mono font-bold text-slate-500">
              {rowHeight}px Row
            </span>
            <CtrlBtn onClick={() => setRowHeight(Math.min(120, rowHeight + 10))} title="Expand rows">
              <Maximize2 size={15} />
            </CtrlBtn>
          </div>
        </div>

        {/* Engine badge */}
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(0,240,255,0.05)',
            border: '1px solid rgba(0,240,255,0.1)',
            color: 'rgba(0,240,255,0.5)',
          }}
        >
          D3 Timeline Engine
        </span>
      </div>

      {/* ── Chart Viewport ── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto rounded-2xl"
        style={{
          background: 'rgba(3,3,10,0.5)',
          border: '1px solid rgba(255,255,255,0.05)',
          minHeight: 0,
        }}
      >
        <svg ref={svgRef} />
      </div>
    </div>
  );
};

export default GanttChart;
