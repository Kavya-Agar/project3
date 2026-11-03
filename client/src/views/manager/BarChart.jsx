import { formatMoney } from '../../utils/money';

const CHART = { WIDTH: 720, HEIGHT: 260, PAD_LEFT: 56, PAD_BOTTOM: 36, PAD_TOP: 12, PAD_RIGHT: 8, GRID_LINES: 4 };

// Accessible SVG bar chart; `data` is [{ label, value }].
export default function BarChart({ data, title, formatValue = formatMoney }) {
  if (!data.length) return <p>No data for this period.</p>;

  const plotWidth = CHART.WIDTH - CHART.PAD_LEFT - CHART.PAD_RIGHT;
  const plotHeight = CHART.HEIGHT - CHART.PAD_TOP - CHART.PAD_BOTTOM;
  const max = Math.max(...data.map((point) => point.value)) || 1;
  const slot = plotWidth / data.length;
  const labelEvery = Math.ceil(data.length / 10);

  return (
    <svg className="chart" viewBox={`0 0 ${CHART.WIDTH} ${CHART.HEIGHT}`} role="img" aria-label={title}>
      <title>{title}</title>
      {Array.from({ length: CHART.GRID_LINES + 1 }, (_, index) => {
        const y = CHART.PAD_TOP + (plotHeight * index) / CHART.GRID_LINES;
        return (
          <g key={index}>
            <line className="chart__axis" x1={CHART.PAD_LEFT} x2={CHART.WIDTH - CHART.PAD_RIGHT} y1={y} y2={y} />
            <text className="chart__label" x={CHART.PAD_LEFT - 6} y={y + 4} textAnchor="end">
              {formatValue(max * (1 - index / CHART.GRID_LINES))}
            </text>
          </g>
        );
      })}
      {data.map((point, index) => {
        const height = (point.value / max) * plotHeight;
        const x = CHART.PAD_LEFT + index * slot + slot * 0.15;
        return (
          <g key={point.label}>
            <rect className="chart__bar" x={x} y={CHART.PAD_TOP + plotHeight - height}
                  width={slot * 0.7} height={height}>
              <title>{`${point.label}: ${formatValue(point.value)}`}</title>
            </rect>
            {index % labelEvery === 0 && (
              <text className="chart__label" x={x + slot * 0.35} y={CHART.HEIGHT - 14} textAnchor="middle">
                {point.label.slice(5)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
