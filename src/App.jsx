import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./styles.css";

// Main dashboard settings

// Official Open Government links
const OPEN_DATA_URL_EN =
  "https://open.canada.ca/data/en/dataset/390ee890-59bb-4f34-a37c-9732781ef8a0";
const OPEN_DATA_URL_FR =
  "https://open.canada.ca/data/fr/dataset/390ee890-59bb-4f34-a37c-9732781ef8a0";
const CSV_PATHS = ["/data/wages_clean.csv", "/wages_clean.csv"];

// Years shown in both charts.
const YEARS = Array.from({ length: 11 }, (_, index) => 2016 + index);
const DEFAULT_YEAR = 2026;

// I keep the province name, short label and colour together so I only
// need to update one place when a province is used in the dashboard.
const PROVINCES = [
  {
    key: "Alberta",
    colorClass: "j-alberta",
    name: { en: "Alberta", fr: "Alberta" },
    short: { en: "AB", fr: "AB" },
  },
  {
    key: "British Columbia",
    colorClass: "j-bc",
    name: { en: "British Columbia", fr: "Colombie-Britannique" },
    short: { en: "BC", fr: "C.-B." },
  },
  {
    key: "Manitoba",
    colorClass: "j-manitoba",
    name: { en: "Manitoba", fr: "Manitoba" },
    short: { en: "MB", fr: "MB" },
  },
  {
    key: "New Brunswick",
    colorClass: "j-nb",
    name: { en: "New Brunswick", fr: "Nouveau-Brunswick" },
    short: { en: "NB", fr: "N.-B." },
  },
  {
    key: "Newfoundland and Labrador",
    colorClass: "j-nl",
    name: { en: "Newfoundland & Labrador", fr: "Terre-Neuve-et-Labrador" },
    short: { en: "NL", fr: "T.-N.-L." },
  },
  {
    key: "Nova Scotia",
    colorClass: "j-ns",
    name: { en: "Nova Scotia", fr: "Nouvelle-Écosse" },
    short: { en: "NS", fr: "N.-É." },
  },
  {
    key: "Ontario",
    colorClass: "j-ontario",
    name: { en: "Ontario", fr: "Ontario" },
    short: { en: "ON", fr: "ON" },
  },
  {
    key: "Prince Edward Island",
    colorClass: "j-pei",
    name: { en: "Prince Edward Island", fr: "Île-du-Prince-Édouard" },
    short: { en: "PEI", fr: "Î.-P.-É." },
  },
  {
    key: "Quebec",
    colorClass: "j-quebec",
    name: { en: "Quebec", fr: "Québec" },
    short: { en: "QC", fr: "QC" },
  },
  {
    key: "Saskatchewan",
    colorClass: "j-saskatchewan",
    name: { en: "Saskatchewan", fr: "Saskatchewan" },
    short: { en: "SK", fr: "SK" },
  },
];

const ALL_PROVINCES = PROVINCES.map((province) => province.key);
const FEATURED_PROVINCES = [
  "Ontario",
  "Quebec",
  "British Columbia",
  "Alberta",
  "Nova Scotia",
];

// Text used by the English and French versions

const COPY = {
  en: {
    title: "Canadian Provincial Minimum Wage Dashboard",
    brandTitle: "Minimum Wage Explorer",
    subtitle:
      "Explore minimum hourly wages across Canadian provinces from 2016 to 2026.",
    skipCharts: "Skip to charts",
    skipControls: "Skip to dashboard controls",
    controlsTitle: "Explore the data",
    controlHelp:
      "Choose provinces, compare years, and switch between hourly wage and growth since 2016.",
    keyMetrics: "Key dashboard metrics",
    chartScrollHint:
      "On a small screen, swipe or use Shift + mouse wheel to view the full chart.",
    tableScrollHint:
      "The exact-values table can be scrolled horizontally on a small screen.",
    opensNewTab: "opens in a new tab",
    language: "Language",
    openData: "Open Government dataset",
    quickView: "Quick view",
    starter: "Featured provinces",
    allCanada: "All provinces",
    custom: "Custom selection",
    comparisonYear: "Comparison year",
    measure: "Measure",
    wage: "Wage",
    growth: "Growth since 2016",
    editSelection: "Edit provinces",
    closeSelection: "Close selection",
    reset: "Reset all",
    selectAll: "Select all",
    clearSelection: "Keep Ontario only",
    selectedCount: "provinces selected",
    atLeastOne: "At least one province must remain selected.",
    focus: "Focused province",
    noFocus: "No focus",
    average: "Selected average",
    averageHelp:
      "Adds the values for the provinces currently shown and divides by the number selected. This is a dashboard comparison average, not an official national minimum wage.",
    highest: "Highest",
    highestHelp:
      "Shows the highest value among the provinces currently displayed for the selected year and measure.",
    spread: "Range",
    spreadHelp:
      "Subtracts the lowest selected value from the highest selected value. It shows how far apart the displayed provinces are for the selected year.",
    trendTitle: "Minimum Wage History",
    trendHelp:
      "Select a legend item or data point to highlight the same province across the dashboard.",
    compareTitle: "Minimum Wage by Province",
    compareHelp:
      "Select a bar to highlight that province in both charts. Use the sort control to change the order.",
    sort: "Sort",
    highestFirst: "Highest first",
    lowestFirst: "Lowest first",
    showAverage: "Show selected average",
    wageAxis: "Minimum wage (CAD/hour)",
    growthAxis: "Change since 2016",
    averageLabel: "Selected average",
    exactDataTitle: "Exact values for the current year",
    province: "Province",
    value: "Value",
    rank: "Rank",
    vsAverage: "vs Average",
    loading: "Loading wage data…",
    errorTitle: "The wage data could not be loaded.",
    errorText: "Place wages_clean.csv in public/data or in the public folder.",
    retry: "Try again",
    noData: "No data for this selection.",
    dashboardUpdated: "Dashboard updated",
    info: "Info",
    howToUse: "How to use this dashboard",
    closeInfoPanel: "Close information panel",
    selectProvincesTitle: "Select provinces",
    selectProvincesText:
      "Use Quick view or Edit provinces to choose which provincial rates are shown.",
    changeYearTitle: "Change the year",
    changeYearText:
      "Use Comparison year or select a year on the line chart. Both charts and the KPI cards update.",
    switchMeasureTitle: "Switch the measure",
    switchMeasureText:
      "Choose Wage for hourly rates or Growth since 2016 to compare percentage change.",
    focusProvinceTitle: "Focus a province",
    focusProvinceText:
      "Select a legend item, data point or bar to highlight the same province in both charts.",
    resetViewTitle: "Reset the dashboard",
    resetViewText:
      "Reset all returns to the featured provinces, 2026, Wage, highest-first sorting and the average reference line.",
    dataTransparencyTitle: "Data Transparency",
    dataReal:
      "All figures come from the Government of Canada's official minimum wage database.",
    dataProjected:
      "All displayed values come from official historical records. The dashboard uses the rate in effect on January 1 of each year; no synthetic values are used.",
    provinceAxis: "Province",
    yearAxis: "Year",
  },
  fr: {
    title: "Tableau de bord du salaire minimum provincial au Canada",
    brandTitle: "Explorateur du salaire minimum",
    subtitle:
      "Explorez le salaire horaire minimum dans les provinces canadiennes de 2016 à 2026.",
    skipCharts: "Aller aux graphiques",
    skipControls: "Aller aux contrôles du tableau de bord",
    controlsTitle: "Explorer les données",
    controlHelp:
      "Choisissez les provinces, comparez les années et passez du salaire horaire à la croissance depuis 2016.",
    keyMetrics: "Indicateurs principaux du tableau de bord",
    chartScrollHint:
      "Sur un petit écran, balayez ou utilisez Majuscule + molette pour voir tout le graphique.",
    tableScrollHint:
      "Le tableau des valeurs exactes peut défiler horizontalement sur un petit écran.",
    opensNewTab: "s’ouvre dans un nouvel onglet",
    language: "Langue",
    openData: "Jeu de données du gouvernement ouvert",
    quickView: "Vue rapide",
    starter: "Provinces principales",
    allCanada: "Toutes les provinces",
    custom: "Sélection personnalisée",
    comparisonYear: "Année de comparaison",
    measure: "Mesure",
    wage: "Salaire",
    growth: "Croissance depuis 2016",
    editSelection: "Modifier les provinces",
    closeSelection: "Fermer la sélection",
    reset: "Tout réinitialiser",
    selectAll: "Tout sélectionner",
    clearSelection: "Garder l’Ontario",
    selectedCount: "provinces sélectionnées",
    atLeastOne: "Au moins une province doit rester sélectionnée.",
    focus: "Province mise en évidence",
    noFocus: "Aucune mise en évidence",
    average: "Moyenne sélectionnée",
    averageHelp:
      "Additionne les valeurs des provinces affichées et divise le total par leur nombre. Il s’agit d’une moyenne de comparaison du tableau de bord, et non d’un salaire minimum national officiel.",
    highest: "Plus élevé",
    highestHelp:
      "Affiche la valeur la plus élevée parmi les provinces présentées pour l’année et la mesure choisies.",
    spread: "Écart",
    spreadHelp:
      "Soustrait la valeur la plus faible de la plus élevée. Cette mesure montre l’écart entre les provinces pour l’année choisie.",
    trendTitle: "Historique du salaire minimum",
    trendHelp:
      "Sélectionnez un élément de légende ou un point pour mettre la même province en évidence dans le tableau de bord.",
    compareTitle: "Salaire minimum par province",
    compareHelp:
      "Sélectionnez une barre pour mettre cette province en évidence dans les deux graphiques. Utilisez le menu pour changer le tri.",
    sort: "Tri",
    highestFirst: "Plus élevé d'abord",
    lowestFirst: "Plus faible d'abord",
    showAverage: "Afficher la moyenne sélectionnée",
    wageAxis: "Salaire minimum (CAD/heure)",
    growthAxis: "Variation depuis 2016",
    averageLabel: "Moyenne sélectionnée",
    exactDataTitle: "Valeurs exactes pour l'année actuelle",
    province: "Province",
    value: "Valeur",
    rank: "Rang",
    vsAverage: "vs Moyenne",
    loading: "Chargement des données salariales…",
    errorTitle: "Les données salariales n'ont pas pu être chargées.",
    errorText:
      "Placez wages_clean.csv dans public/data ou dans le dossier public.",
    retry: "Réessayer",
    noData: "Aucune donnée pour cette sélection.",
    dashboardUpdated: "Tableau de bord mis à jour",
    info: "Info",
    howToUse: "Comment utiliser ce tableau de bord",
    closeInfoPanel: "Fermer le panneau d’information",
    selectProvincesTitle: "Choisir les provinces",
    selectProvincesText:
      "Utilisez Vue rapide ou Modifier les provinces pour choisir les taux provinciaux affichés.",
    changeYearTitle: "Changer l’année",
    changeYearText:
      "Utilisez Année de comparaison ou sélectionnez une année dans le graphique linéaire. Les deux graphiques et les indicateurs se mettent à jour.",
    switchMeasureTitle: "Changer la mesure",
    switchMeasureText:
      "Choisissez Salaire pour les taux horaires ou Croissance depuis 2016 pour comparer la variation en pourcentage.",
    focusProvinceTitle: "Mettre une province en évidence",
    focusProvinceText:
      "Sélectionnez un élément de légende, un point ou une barre pour mettre la même province en évidence dans les deux graphiques.",
    resetViewTitle: "Réinitialiser le tableau de bord",
    resetViewText:
      "Tout réinitialiser revient aux provinces principales, à 2026, au salaire, au tri décroissant et à la ligne de moyenne.",
    dataTransparencyTitle: "Transparence des données",
    dataReal:
      "Toutes les valeurs proviennent de la base de données officielle du salaire minimum du gouvernement du Canada.",
    dataProjected:
      "Toutes les valeurs affichées proviennent de dossiers historiques officiels. Le tableau de bord utilise le taux en vigueur le 1er janvier de chaque année; aucune valeur synthétique n’est utilisée.",
    provinceAxis: "Province",
    yearAxis: "Année",
  },
};

// Small helper functions used by the charts

// This small parser handles quoted values in the CSV.
function parseCsv(text) {
  const rows = [];
  let current = "";
  let row = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(current);
      current = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  if (current || row.length) {
    row.push(current);
    rows.push(row);
  }

  const headers = rows.shift()?.map((header) => header.trim()) || [];
  return rows.map((values) =>
    headers.reduce((record, header, index) => {
      record[header] = values[index]?.trim() || "";
      return record;
    }, {}),
  );
}

function getLocale(language) {
  return language === "fr" ? "fr-CA" : "en-CA";
}

// Format money for English or French.
function formatCurrency(value, language) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(getLocale(language), {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format percentage values for English or French.
function formatPercent(value, language) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(getLocale(language), {
    style: "percent",
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  }).format(value / 100);
}

// Find the colour and labels for one province.
function provinceMeta(key) {
  return PROVINCES.find((province) => province.key === key);
}

// Clamp a value between min and max
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Let keyboard users activate chart items with Enter or Space.
function activateWithKeyboard(event, action) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}

// Calculate an average while ignoring missing values.
function average(values) {
  const valid = values.filter(Number.isFinite);
  return valid.length
    ? valid.reduce((sum, value) => sum + value, 0) / valid.length
    : null;
}

// Choose simple tick intervals such as 5, 10, 20 or 50.
function niceTickStep(target) {
  const safeTarget = Math.max(target, 0.1);
  const magnitude = 10 ** Math.floor(Math.log10(safeTarget));
  const normalized = safeTarget / magnitude;

  if (normalized <= 1.5) return magnitude;
  if (normalized <= 3) return 2 * magnitude;
  if (normalized <= 7) return 5 * magnitude;
  return 10 * magnitude;
}

// Both charts use this helper so their axes are calculated the same way.
function getAxisBounds(values, metric, startAtZero = false) {
  const valid = values.filter(Number.isFinite);
  if (!valid.length) return { yMin: 0, yMax: 1, step: 1 };

  const dataMin = Math.min(...valid);
  const dataMax = Math.max(...valid);

  if (metric === "growth") {
    const baseMin = Math.min(dataMin, 0);
    const baseMax = Math.max(dataMax, 0);
    const range = Math.max(baseMax - baseMin, 5);
    const step = niceTickStep(range / 5);
    const yMin = dataMin >= 0 ? 0 : Math.floor(dataMin / step) * step;
    const yMax = Math.max(yMin + step, Math.ceil(dataMax / step) * step);
    return { yMin, yMax, step };
  }

  if (startAtZero) {
    const step = niceTickStep(Math.max(dataMax, 1) / 5);
    return {
      yMin: 0,
      yMax: Math.max(step, Math.ceil(dataMax / step) * step),
      step,
    };
  }

  const range = Math.max(dataMax - dataMin, 2);
  const step = niceTickStep(range / 5);
  const yMin = Math.max(0, Math.floor((dataMin - step * 0.5) / step) * step);
  const yMax = Math.max(
    yMin + step,
    Math.ceil((dataMax + step * 0.5) / step) * step,
  );
  return { yMin, yMax, step };
}

// Reusable interface components

// Small KPI card. The information button explains how the value is calculated.
function KpiCard({
  label,
  value,
  detail,
  help,
  tone = "teal",
  tooltipAlign = "center",
}) {
  const [showHelp, setShowHelp] = useState(false);
  const tooltipId = useId();

  return (
    <article
      className={`kpi-card tone-${tone} ${
        tooltipAlign === "right" ? "tooltip-right" : ""
      } ${showHelp ? "tooltip-open" : ""}`}
    >
      <div className="kpi-label-row">
        <span>{label}</span>
        <button
          type="button"
          className="kpi-info"
          aria-label={`${label}: ${help}`}
          aria-describedby={showHelp ? tooltipId : undefined}
          aria-expanded={showHelp}
          onMouseEnter={() => setShowHelp(true)}
          onMouseLeave={() => setShowHelp(false)}
          onFocus={() => setShowHelp(true)}
          onBlur={() => setShowHelp(false)}
          onClick={() => setShowHelp((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setShowHelp(false);
              event.currentTarget.blur();
            }
          }}
        >
          <span className="kpi-info-icon" aria-hidden="true">
            i
          </span>
          {showHelp ? (
            <span id={tooltipId} className="kpi-tooltip" role="tooltip">
              {help}
            </span>
          ) : null}
        </button>
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

// Reusable segmented control (toggle buttons)
function SegmentedControl({ label, value, options, onChange }) {
  return (
    <fieldset className="segmented-control">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? "active" : ""}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

// Tooltip component for charts
function Tooltip({ tooltip }) {
  if (!tooltip) return null;
  return (
    <div
      className="tooltip"
      style={{ left: `${tooltip.x}%`, top: `${tooltip.y}%` }}
    >
      <strong>{tooltip.title}</strong>
      {tooltip.lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  );
}

// Empty state placeholder
function EmptyState({ text }) {
  return <div className="empty-state">{text}</div>;
}

// Province selection controls
function ProvinceSelector({
  selected,
  onToggle,
  onSelectAll,
  onClear,
  language,
  copy,
}) {
  const [message, setMessage] = useState("");

  function handleToggle(key) {
    if (selected.includes(key) && selected.length === 1) {
      setMessage(copy.atLeastOne);
      return;
    }
    setMessage("");
    onToggle(key);
  }

  return (
    <div>
      <div className="selection-actions">
        <span>
          <strong>{selected.length}</strong> {copy.selectedCount}
        </span>
        <div className="selection-bulk-actions">
          <button type="button" onClick={onSelectAll}>
            {copy.selectAll}
          </button>
          <button type="button" onClick={onClear}>
            {copy.clearSelection}
          </button>
        </div>
      </div>
      <div
        className="province-grid"
        role="group"
        aria-label={copy.editSelection}
      >
        {PROVINCES.map((entry) => {
          const active = selected.includes(entry.key);
          return (
            <button
              key={entry.key}
              type="button"
              className={`province-chip ${entry.colorClass} ${active ? "active" : ""}`}
              aria-pressed={active}
              onClick={() => handleToggle(entry.key)}
            >
              <span className="chip-dot" aria-hidden="true" />
              <span>{entry.name[language]}</span>
              <span className="chip-check" aria-hidden="true">
                {active ? "✓" : "+"}
              </span>
            </button>
          );
        })}
      </div>
      {message ? (
        <p className="selection-message" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}

// Trend legend for line chart
function TrendLegend({
  series,
  focusedProvince,
  setFocusedProvince,
  language,
  copy,
}) {
  return (
    <div className="chart-legend" aria-label={copy.focus}>
      <button
        type="button"
        className={
          !focusedProvince
            ? "legend-button active neutral"
            : "legend-button neutral"
        }
        aria-pressed={!focusedProvince}
        onClick={() => setFocusedProvince("")}
      >
        {copy.noFocus}
      </button>
      {series.map((line) => (
        <button
          key={line.key}
          type="button"
          className={`legend-button ${line.colorClass} ${focusedProvince === line.key ? "active" : ""}`}
          aria-pressed={focusedProvince === line.key}
          onClick={() =>
            setFocusedProvince((current) =>
              current === line.key ? "" : line.key,
            )
          }
        >
          <span className="legend-swatch" aria-hidden="true" />
          {provinceMeta(line.key).name[language]}
        </button>
      ))}
    </div>
  );
}

// The two interactive charts

// Multi-line chart for wage trends over time
function MultiLineChart({
  series,
  years,
  selectedYear,
  onSelectYear,
  metric,
  focusedProvince,
  language,
  copy,
}) {
  const [tooltip, setTooltip] = useState(null);
  // The wider viewBox gives the lines more room without adding page padding.
  const width = 1240;
  const height = 430;
  const pad = { top: 28, right: 22, bottom: 70, left: 86 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  if (!series.length || years.length < 2)
    return <EmptyState text={copy.noData} />;

  // Calculate chart values (wage or growth)
  const chartSeries = series.map((line) => {
    const baseline =
      line.points.find((point) => point.year === YEARS[0])?.wage ?? null;
    return {
      ...line,
      points: line.points.map((point) => ({
        ...point,
        chartValue:
          metric === "growth" && Number.isFinite(baseline)
            ? ((point.wage - baseline) / baseline) * 100
            : point.wage,
      })),
    };
  });

  // The shared helper keeps the scale close to the actual values.
  const allValues = chartSeries.flatMap((line) =>
    line.points.map((point) => point.chartValue),
  );
  const { yMin, yMax, step } = getAxisBounds(allValues, metric);

  // Scale functions
  const x = (year) =>
    pad.left +
    ((year - years[0]) / (years[years.length - 1] - years[0])) * innerW;
  const y = (value) =>
    pad.top + (1 - (value - yMin) / Math.max(1, yMax - yMin)) * innerH;

  // Generate Y-axis ticks
  const ticks = [];
  for (let value = yMin; value <= yMax + step * 0.2; value += step)
    ticks.push(value);

  return (
    <div>
      <p className="sr-only">{copy.chartScrollHint}</p>
      <div
        className="chart-wrap"
        role="region"
        tabIndex={0}
        aria-label={`${copy.trendTitle}. ${copy.chartScrollHint}`}
      >
        <svg
          className="svg-chart line-chart-svg"
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-labelledby="trend-chart-title trend-chart-description"
        >
          <title id="trend-chart-title">{copy.trendTitle}</title>
          <desc id="trend-chart-description">{copy.trendHelp}</desc>
          <text
            className="axis-title"
            x="22"
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 22 ${height / 2})`}
          >
            {metric === "growth" ? copy.growthAxis : copy.wageAxis}
          </text>
          <text
            className="axis-title"
            x={pad.left + innerW / 2}
            y={height - 12}
            textAnchor="middle"
          >
            {copy.yearAxis}
          </text>

          {/* Y-axis grid lines and labels */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                className={Math.abs(tick) < 0.001 ? "zero-line" : "grid-line"}
                x1={pad.left}
                x2={width - pad.right}
                y1={y(tick)}
                y2={y(tick)}
              />
              <text
                className="axis-text"
                x={pad.left - 18}
                y={y(tick) + 4}
                textAnchor="end"
              >
                {metric === "growth"
                  ? `${tick}%`
                  : formatCurrency(tick, language)}
              </text>
            </g>
          ))}

          {/* Year labels (clickable) */}
          {years.map((year) => (
            <text
              key={year}
              className={
                year === selectedYear
                  ? "axis-text year-label selected-year"
                  : "axis-text year-label"
              }
              x={x(year)}
              y={height - 34}
              textAnchor="middle"
              tabIndex={0}
              role="button"
              aria-pressed={year === selectedYear}
              onClick={() => onSelectYear(year)}
              onKeyDown={(event) =>
                activateWithKeyboard(event, () => onSelectYear(year))
              }
            >
              {year}
            </text>
          ))}

          {/* Trend lines */}
          {chartSeries.map((line) => {
            const dimmed = focusedProvince && focusedProvince !== line.key;
            const path = line.points
              .map(
                (point, index) =>
                  `${index === 0 ? "M" : "L"}${x(point.year)},${y(point.chartValue)}`,
              )
              .join(" ");
            return (
              <path
                key={line.key}
                className={`trend-line ${line.colorClass} ${dimmed ? "dimmed" : ""}`}
                d={path}
              />
            );
          })}

          {/* Data points (clickable) */}
          {chartSeries.map((line) => {
            const dimmed = focusedProvince && focusedProvince !== line.key;
            return line.points.map((point) => {
              const px = x(point.year);
              const py = y(point.chartValue);
              const active = point.year === selectedYear;
              const formatted =
                metric === "growth"
                  ? formatPercent(point.chartValue, language)
                  : formatCurrency(point.wage, language);
              const detail = {
                x: clamp((px / width) * 100 + 2, 8, 72),
                y: clamp((py / height) * 100, 12, 84),
                title: `${provinceMeta(line.key).name[language]} · ${point.year}`,
                lines: [
                  `${metric === "growth" ? copy.growth : copy.wage}: ${formatted}`,
                ],
              };
              return (
                <g
                  key={`${line.key}-${point.year}`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={active}
                  aria-label={`${detail.title}: ${formatted}`}
                  onClick={() => onSelectYear(point.year)}
                  onKeyDown={(event) =>
                    activateWithKeyboard(event, () => onSelectYear(point.year))
                  }
                  onMouseEnter={() => setTooltip(detail)}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={() => setTooltip(detail)}
                  onBlur={() => setTooltip(null)}
                  className={dimmed ? "chart-mark dimmed" : "chart-mark"}
                >
                  <circle className="hit" cx={px} cy={py} r="14" />
                  {active ? (
                    <circle className="point-ring" cx={px} cy={py} r="10" />
                  ) : null}
                  <circle
                    className={`trend-dot ${line.colorClass}`}
                    cx={px}
                    cy={py}
                    r={active ? 6.5 : 5}
                  />
                </g>
              );
            });
          })}
        </svg>
        <Tooltip tooltip={tooltip} />
      </div>
    </div>
  );
}

// Bar chart used to compare provinces
function CompactBarChart({
  data,
  metric,
  language,
  copy,
  focusedProvince,
  setFocusedProvince,
  showAverage,
}) {
  const [tooltip, setTooltip] = useState(null);
  // The bars use nearly the full card width.
  const width = 1240;
  const height = 380;
  const pad = { top: 34, right: 24, bottom: 84, left: 86 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const values = data.map((row) => row.chartValue).filter(Number.isFinite);

  if (!data.length) return <EmptyState text={copy.noData} />;

  // The bar chart starts at zero for wage values, which makes comparisons clearer.
  const { yMin, yMax, step } = getAxisBounds(values, metric, true);
  const y = (value) =>
    pad.top + (1 - (value - yMin) / Math.max(1, yMax - yMin)) * innerH;
  const zeroY = y(0);
  const slot = innerW / Math.max(data.length, 1);
  const barWidth = Math.min(54, slot * 0.58);
  const selectedAverage = average(values);
  const averageY = Number.isFinite(selectedAverage) ? y(selectedAverage) : null;

  // Generate Y-axis ticks
  const ticks = [];
  for (let value = yMin; value <= yMax + step * 0.2; value += step)
    ticks.push(value);

  return (
    <div>
      <p className="sr-only">{copy.chartScrollHint}</p>
      <div
        className="chart-wrap"
        role="region"
        tabIndex={0}
        aria-label={`${copy.compareTitle}. ${copy.chartScrollHint}`}
      >
        <svg
          className="svg-chart bar-chart-svg"
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-labelledby="bar-chart-title bar-chart-description"
        >
          <title id="bar-chart-title">{copy.compareTitle}</title>
          <desc id="bar-chart-description">{copy.compareHelp}</desc>
          <text
            className="axis-title"
            x="22"
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 22 ${height / 2})`}
          >
            {metric === "growth" ? copy.growthAxis : copy.wageAxis}
          </text>
          <text
            className="axis-title"
            x={pad.left + innerW / 2}
            y={height - 12}
            textAnchor="middle"
          >
            {copy.provinceAxis}
          </text>

          {/* Y-axis grid lines and labels */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                className={Math.abs(tick) < 0.001 ? "zero-line" : "grid-line"}
                x1={pad.left}
                x2={width - pad.right}
                y1={y(tick)}
                y2={y(tick)}
              />
              <text
                className="axis-text"
                x={pad.left - 18}
                y={y(tick) + 4}
                textAnchor="end"
              >
                {metric === "growth"
                  ? `${tick}%`
                  : formatCurrency(tick, language)}
              </text>
            </g>
          ))}

          {/* Average line (toggleable) */}
          {showAverage && averageY != null ? (
            <g>
              <line
                className="average-line"
                x1={pad.left}
                x2={width - pad.right}
                y1={averageY}
                y2={averageY}
              />
              <text
                className="average-label"
                x={width - pad.right}
                y={averageY - 7}
                textAnchor="end"
              >
                {copy.averageLabel}
              </text>
            </g>
          ) : null}

          {/* Bar chart data */}
          {data.map((row, index) => {
            const cx = pad.left + slot * index + slot / 2;
            const valueY = y(row.chartValue);
            const rectY = Math.min(zeroY, valueY);
            const rectHeight = Math.max(3, Math.abs(zeroY - valueY));
            const isFocused = focusedProvince === row.key;
            const formatted =
              metric === "growth"
                ? formatPercent(row.chartValue, language)
                : formatCurrency(row.wage, language);
            const compactValue =
              metric === "growth"
                ? `${new Intl.NumberFormat(getLocale(language), { maximumFractionDigits: 0, signDisplay: "exceptZero" }).format(row.chartValue)}%`
                : new Intl.NumberFormat(getLocale(language), {
                    style: "currency",
                    currency: "CAD",
                    maximumFractionDigits: 1,
                  }).format(row.wage);
            const detail = {
              x: clamp((cx / width) * 100, 10, 75),
              y: clamp((rectY / height) * 100, 12, 84),
              title: row.label,
              lines: [
                `${metric === "growth" ? copy.growth : copy.wage}: ${formatted}`,
              ],
            };
            const focus = () =>
              setFocusedProvince((current) =>
                current === row.key ? "" : row.key,
              );
            const shortLabel = provinceMeta(row.key).short[language];

            return (
              <g
                key={row.key}
                tabIndex={0}
                role="button"
                aria-pressed={isFocused}
                aria-label={`${row.label}: ${formatted}`}
                onClick={focus}
                onKeyDown={(event) => activateWithKeyboard(event, focus)}
                onMouseEnter={() => setTooltip(detail)}
                onMouseLeave={() => setTooltip(null)}
                onFocus={() => setTooltip(detail)}
                onBlur={() => setTooltip(null)}
                className="chart-mark"
              >
                <rect
                  className="bar-hit"
                  x={cx - slot / 2 + 2}
                  y={pad.top}
                  width={slot - 4}
                  height={innerH}
                />
                <rect
                  className={`ranking-bar ${row.colorClass} ${isFocused ? "focused-bar" : ""}`}
                  x={cx - barWidth / 2}
                  y={rectY}
                  width={barWidth}
                  height={rectHeight}
                  rx="6"
                />
                <text
                  className="compact-bar-value"
                  x={cx}
                  y={row.chartValue < 0 ? rectY + rectHeight + 18 : rectY - 10}
                  textAnchor="middle"
                >
                  {compactValue}
                </text>
                <text
                  className={
                    isFocused
                      ? "compact-axis-label focused-label"
                      : "compact-axis-label"
                  }
                  x={cx}
                  y={height - 42}
                  textAnchor="middle"
                >
                  {shortLabel}
                </text>
              </g>
            );
          })}
        </svg>
        <Tooltip tooltip={tooltip} />
      </div>
    </div>
  );
}

// Main dashboard component

export default function App() {
  // Main state for the language, data and filters
  const [language, setLanguage] = useState("en");
  const [rawRows, setRawRows] = useState([]);
  const [loadingState, setLoadingState] = useState("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedProvinces, setSelectedProvinces] =
    useState(FEATURED_PROVINCES);
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);
  const [metric, setMetric] = useState("wage");
  const [quickView, setQuickView] = useState("starter");
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAverage, setShowAverage] = useState(true);
  const [focusedProvince, setFocusedProvince] = useState("");
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const infoButtonRef = useRef(null);
  const infoPanelRef = useRef(null);
  const infoCloseRef = useRef(null);

  const copy = COPY[language];
  const openDataUrl = language === "fr" ? OPEN_DATA_URL_FR : OPEN_DATA_URL_EN;

  // Keep the page language and browser title synchronized with the language switch.
  useEffect(() => {
    document.documentElement.lang = language === "fr" ? "fr-CA" : "en-CA";
    document.title = copy.title;
  }, [copy.title, language]);

  // The information panel behaves like a dialog for keyboard and screen-reader users.
  useEffect(() => {
    if (!sidePanelOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    infoCloseRef.current?.focus();

    function handleDialogKeys(event) {
      if (event.key === "Escape") {
        setSidePanelOpen(false);
        requestAnimationFrame(() => infoButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab" || !infoPanelRef.current) return;

      const focusable = [
        ...infoPanelRef.current.querySelectorAll(
          'button, a[href], select, input, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((element) => !element.hasAttribute("disabled"));

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleDialogKeys);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleDialogKeys);
    };
  }, [sidePanelOpen]);

  function closeInfoPanel() {
    setSidePanelOpen(false);
    requestAnimationFrame(() => infoButtonRef.current?.focus());
  }

  // Load the CSV when the page opens or when the user retries.

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoadingState("loading");
      for (const path of CSV_PATHS) {
        try {
          const response = await fetch(path);
          if (!response.ok) continue;
          const text = await response.text();
          if (!text.trim()) continue;
          const parsed = parseCsv(text).map((row) => ({
            jurisdiction: row.jurisdiction,
            effectiveDate: row.effective_date,
            wage: row.wage ? Number(row.wage) : null,
          }));
          if (!cancelled) {
            setRawRows(parsed);
            setLoadingState("ready");
          }
          return;
        } catch {
          // Try the next location.
        }
      }
      if (!cancelled) setLoadingState("error");
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Filter out invalid rows
  const rows = useMemo(
    () =>
      rawRows.filter(
        (row) =>
          row.jurisdiction &&
          ALL_PROVINCES.includes(row.jurisdiction) &&
          row.effectiveDate &&
          Number.isFinite(row.wage) &&
          row.wage > 0,
      ),
    [rawRows],
  );

  // Functions used to prepare the annual wage values.

  // Find the wage that was active on January 1 of the selected year
  function wageAsOf(province, year) {
    const cutoff = `${year}-01-01`;
    let latest = null;
    for (const row of rows) {
      if (row.jurisdiction !== province || row.effectiveDate > cutoff) continue;
      if (!latest || row.effectiveDate > latest.effectiveDate) latest = row;
    }
    return latest ? latest.wage : null;
  }

  // Apply the featured or all-provinces shortcut
  function applyQuickView(value) {
    setQuickView(value);
    setFocusedProvince("");
    if (value === "starter") setSelectedProvinces(FEATURED_PROVINCES);
    if (value === "all") setSelectedProvinces(ALL_PROVINCES);
  }

  // Add or remove one province
  function toggleProvince(key) {
    setSelectedProvinces((current) =>
      current.includes(key)
        ? current.length === 1
          ? current
          : current.filter((entry) => entry !== key)
        : [...current, key],
    );
    setQuickView("custom");
    if (focusedProvince === key && selectedProvinces.includes(key)) {
      setFocusedProvince("");
    }
  }

  // Return the dashboard to the same simple view shown when the page first opens.
  function resetAll() {
    setSelectedProvinces(FEATURED_PROVINCES);
    setSelectedYear(DEFAULT_YEAR);
    setMetric("wage");
    setQuickView("starter");
    setSelectionOpen(false);
    setSortOrder("desc");
    setShowAverage(true);
    setFocusedProvince("");
  }

  // Prepare the values shared by the charts, KPIs and table.

  // Provinces shown in the current view
  const activeEntries = useMemo(
    () => PROVINCES.filter((entry) => selectedProvinces.includes(entry.key)),
    [selectedProvinces],
  );

  // Data for line chart (trend over time)
  const lineSeries = useMemo(
    () =>
      activeEntries.map((entry) => ({
        key: entry.key,
        colorClass: entry.colorClass,
        points: YEARS.map((year) => ({
          year,
          wage: wageAsOf(entry.key, year),
        })).filter((point) => Number.isFinite(point.wage)),
      })),
    [activeEntries, rows],
  );

  // Data for bar chart and table (comparison by year)
  const rankingData = useMemo(() => {
    const data = activeEntries
      .map((entry) => {
        const wage = wageAsOf(entry.key, selectedYear);
        const baseline = wageAsOf(entry.key, YEARS[0]);
        if (!Number.isFinite(wage)) return null;
        const growth = Number.isFinite(baseline)
          ? ((wage - baseline) / baseline) * 100
          : null;
        return {
          key: entry.key,
          label: entry.name[language],
          wage,
          growth,
          chartValue: metric === "growth" ? growth : wage,
          colorClass: entry.colorClass,
        };
      })
      .filter((row) => row && Number.isFinite(row.chartValue));

    return data.sort((a, b) =>
      sortOrder === "asc"
        ? a.chartValue - b.chartValue
        : b.chartValue - a.chartValue,
    );
  }, [activeEntries, language, metric, rows, selectedYear, sortOrder]);

  // Calculate KPI values
  const averageValue = average(rankingData.map((row) => row.chartValue));
  const highest = rankingData.length
    ? rankingData.reduce((best, row) =>
        row.chartValue > best.chartValue ? row : best,
      )
    : null;
  const lowest = rankingData.length
    ? rankingData.reduce((best, row) =>
        row.chartValue < best.chartValue ? row : best,
      )
    : null;
  const spread =
    highest && lowest ? highest.chartValue - lowest.chartValue : null;

  // Show clear feedback while the file is loading or if it fails.

  if (loadingState === "loading") {
    return (
      <main className="app-state" role="status" aria-live="polite">
        <span className="spinner" aria-hidden="true" />
        {copy.loading}
      </main>
    );
  }

  if (loadingState === "error" || !rows.length) {
    return (
      <main className="app-state error-state" role="alert">
        <h1>{copy.errorTitle}</h1>
        <p>{copy.errorText}</p>
        <button
          type="button"
          onClick={() => setReloadKey((value) => value + 1)}
        >
          {copy.retry}
        </button>
      </main>
    );
  }

  // Dashboard layout

  return (
    <main className="dashboard">
      {/* Keyboard users can bypass the header and go directly to the controls or charts. */}
      <nav className="skip-links" aria-label={copy.language}>
        <a className="skip-link skip-link-controls" href="#controls">
          {copy.skipControls}
        </a>
        <a className="skip-link skip-link-charts" href="#charts">
          {copy.skipCharts}
        </a>
      </nav>

      {/* Button that opens the help panel */}
      <button
        ref={infoButtonRef}
        type="button"
        className="side-panel-toggle"
        onClick={() => setSidePanelOpen(true)}
        aria-label={copy.info}
        aria-expanded={sidePanelOpen}
        aria-controls="dashboard-info-panel"
      >
        <span aria-hidden="true">i</span>
      </button>

      {/* Help panel with instructions and data notes */}
      {sidePanelOpen ? (
        <aside
          ref={infoPanelRef}
          id="dashboard-info-panel"
          className="side-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-info-title"
        >
          <div className="side-panel-header">
            <h2 id="dashboard-info-title">{copy.info}</h2>
            <button
              ref={infoCloseRef}
              type="button"
              className="side-panel-close"
              onClick={closeInfoPanel}
              aria-label={copy.closeInfoPanel}
            >
              ×
            </button>
          </div>
          <div className="side-panel-content">
            {/* These instructions are translated with the rest of the dashboard. */}
            <section>
              <h3>{copy.howToUse}</h3>
              <ul>
                <li>
                  <strong>{copy.selectProvincesTitle}:</strong>{" "}
                  {copy.selectProvincesText}
                </li>
                <li>
                  <strong>{copy.changeYearTitle}:</strong> {copy.changeYearText}
                </li>
                <li>
                  <strong>{copy.switchMeasureTitle}:</strong>{" "}
                  {copy.switchMeasureText}
                </li>
                <li>
                  <strong>{copy.focusProvinceTitle}:</strong>{" "}
                  {copy.focusProvinceText}
                </li>
                <li>
                  <strong>{copy.resetViewTitle}:</strong> {copy.resetViewText}
                </li>
              </ul>
            </section>
            {/* Data transparency section */}
            <section>
              <h3>{copy.dataTransparencyTitle}</h3>
              <ul className="data-transparency-list">
                <li>
                  ✅ <strong>{copy.dataReal}</strong>
                </li>
                <li>
                  ✅ <strong>{copy.dataProjected}</strong>
                </li>
              </ul>
            </section>
          </div>
        </aside>
      ) : null}

      {/* Clicking the background closes the panel */}
      {sidePanelOpen ? (
        <div
          className="side-panel-overlay"
          aria-hidden="true"
          onClick={closeInfoPanel}
        />
      ) : null}
      {/* Dashboard heading */}
      <header className="hero" id="overview">
        <div className="hero-topline">
          <a className="brand" href="#overview">
            <span className="brand-mark" aria-hidden="true">
              $
            </span>
            <span>{copy.brandTitle}</span>
          </a>
          <div className="language-switch" aria-label={copy.language}>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={language === "fr" ? "active" : ""}
              aria-pressed={language === "fr"}
              onClick={() => setLanguage("fr")}
            >
              FR
            </button>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-copy">
            <div>
              <h1>{copy.title}</h1>
              <p>{copy.subtitle}</p>
            </div>
            <a
              href={openDataUrl}
              target="_blank"
              rel="noreferrer"
              className="hero-data-link"
              aria-label={`${copy.openData}, ${copy.opensNewTab}`}
            >
              {copy.openData} ↗
            </a>
          </div>
        </div>
      </header>
      {/* Filters that update the whole dashboard */}
      <section
        className="command-bar"
        id="controls"
        aria-labelledby="control-title"
      >
        <div>
          <h2 id="control-title" className="command-title">
            {copy.controlsTitle}
          </h2>
          <p className="control-description">{copy.controlHelp}</p>
        </div>

        <div className="command-controls">
          {/* Main province filter */}
          <label>
            <span>{copy.quickView}</span>
            <select
              value={quickView}
              onChange={(event) => applyQuickView(event.target.value)}
            >
              <option value="starter">{copy.starter}</option>
              <option value="all">{copy.allCanada}</option>
              <option value="custom">{copy.custom}</option>
            </select>
          </label>

          {/* This year is used by the KPI cards and bar chart */}
          <label>
            <span>{copy.comparisonYear}</span>
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
            >
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          {/* Users can compare dollar values or growth */}
          <SegmentedControl
            label={copy.measure}
            value={metric}
            onChange={setMetric}
            options={[
              { value: "wage", label: copy.wage },
              { value: "growth", label: copy.growth },
            ]}
          />

          {/* Opens the custom province choices */}
          <button
            type="button"
            className="selection-button"
            aria-expanded={selectionOpen}
            aria-controls="province-selection"
            onClick={() => setSelectionOpen((value) => !value)}
          >
            {selectionOpen ? copy.closeSelection : copy.editSelection}
            <span>{selectedProvinces.length}</span>
          </button>

          {/* Goes back to the original featured-five view */}
          <button type="button" className="reset-button" onClick={resetAll}>
            {copy.reset}
          </button>
        </div>
      </section>

      {/* Optional list for choosing individual provinces */}
      {selectionOpen ? (
        <section
          className="selection-drawer"
          id="province-selection"
          aria-label={copy.editSelection}
        >
          <ProvinceSelector
            selected={selectedProvinces}
            onToggle={toggleProvince}
            onSelectAll={() => {
              setSelectedProvinces(ALL_PROVINCES);
              setQuickView("all");
            }}
            onClear={() => {
              setSelectedProvinces(["Ontario"]);
              setFocusedProvince("");
              setQuickView("custom");
            }}
            language={language}
            copy={copy}
          />
        </section>
      ) : null}
      {/* Three quick summaries of the current selection */}
      <section className="kpi-grid" aria-label={copy.keyMetrics}>
        <KpiCard
          label={copy.average}
          value={
            metric === "growth"
              ? formatPercent(averageValue, language)
              : formatCurrency(averageValue, language)
          }
          detail={`${selectedProvinces.length} ${copy.selectedCount} · ${selectedYear}`}
          help={copy.averageHelp}
          tone="teal"
        />
        <KpiCard
          label={copy.highest}
          value={highest?.label ?? "—"}
          detail={
            highest
              ? metric === "growth"
                ? formatPercent(highest.chartValue, language)
                : formatCurrency(highest.wage, language)
              : "—"
          }
          help={copy.highestHelp}
          tone="navy"
        />
        <KpiCard
          label={copy.spread}
          value={
            metric === "growth"
              ? formatPercent(spread, language)
              : formatCurrency(spread, language)
          }
          detail={`${lowest?.label ?? "—"} → ${highest?.label ?? "—"}`}
          help={copy.spreadHelp}
          tone="amber"
          tooltipAlign="right"
        />
      </section>
      {/* Chart 1: wage history */}
      <section className="line-chart-section" id="charts">
        <article className="panel">
          <header className="panel-header">
            <div className="panel-title-row">
              <div>
                <h2>{copy.trendTitle}</h2>
                <p>{copy.trendHelp}</p>
                <div className="chart-context">
                  <span className="context-badge">
                    {selectedProvinces.length} {copy.selectedCount}
                  </span>
                  <span className="context-badge">
                    {metric === "growth" ? copy.growth : copy.wage}
                  </span>
                  <span className="context-badge">{selectedYear}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Clicking the legend highlights one province */}
          <TrendLegend
            series={lineSeries}
            focusedProvince={focusedProvince}
            setFocusedProvince={setFocusedProvince}
            language={language}
            copy={copy}
          />

          {/* Chart 1: change over time */}
          <MultiLineChart
            series={lineSeries}
            years={YEARS}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
            metric={metric}
            focusedProvince={focusedProvince}
            language={language}
            copy={copy}
          />
        </article>
      </section>
      {/* Chart 2: comparison for one year */}
      <section className="bar-chart-section">
        <article className="panel">
          <header className="panel-header">
            <div className="panel-title-row">
              <div>
                <h2>
                  {copy.compareTitle} · {selectedYear}
                </h2>
                <p>{copy.compareHelp}</p>
                <div className="chart-context">
                  <span className="context-badge">
                    {rankingData.length} {copy.selectedCount}
                  </span>
                  <span className="context-badge">
                    {metric === "growth" ? copy.growth : copy.wage}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* The bar chart has its own sort and average controls */}
          <div className="compare-toolbar">
            <SegmentedControl
              label={copy.sort}
              value={sortOrder}
              onChange={setSortOrder}
              options={[
                { value: "desc", label: copy.highestFirst },
                { value: "asc", label: copy.lowestFirst },
              ]}
            />
            <label className="switch-control">
              <input
                type="checkbox"
                checked={showAverage}
                onChange={(event) => setShowAverage(event.target.checked)}
              />
              <span aria-hidden="true" />
              <strong>{copy.showAverage}</strong>
            </label>
          </div>

          {/* Chart 2: comparison for the selected year */}
          <CompactBarChart
            data={rankingData}
            metric={metric}
            language={language}
            copy={copy}
            focusedProvince={focusedProvince}
            setFocusedProvince={setFocusedProvince}
            showAverage={showAverage}
          />
        </article>
      </section>

      {/* Exact values are kept below the two main charts for users who need details. */}
      <section className="data-table-section">
        <article className="panel table-panel">
          <header className="panel-header">
            <div className="panel-title-row">
              <div>
                <h2>{copy.exactDataTitle}</h2>
                <div className="chart-context">
                  <span className="context-badge">{selectedYear}</span>
                  <span className="context-badge">
                    {metric === "growth" ? copy.growth : copy.wage}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <p className="sr-only">{copy.tableScrollHint}</p>
          <div
            className="table-wrap"
            role="region"
            tabIndex={0}
            aria-label={`${copy.exactDataTitle}. ${copy.tableScrollHint}`}
          >
            <table>
              <caption className="sr-only">
                {copy.exactDataTitle}: {selectedYear},{" "}
                {metric === "growth" ? copy.growth : copy.wage}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{copy.province}</th>
                  <th scope="col">{copy.value}</th>
                  <th scope="col">{copy.rank}</th>
                  <th scope="col">{copy.vsAverage}</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((row, index) => {
                  const vsAverage = row.chartValue - averageValue;
                  const isFocused = focusedProvince === row.key;

                  return (
                    <tr
                      key={row.key}
                      className={isFocused ? "focused-row" : ""}
                      tabIndex={0}
                      aria-pressed={isFocused}
                      aria-label={`${row.label}: ${
                        metric === "growth"
                          ? formatPercent(row.chartValue, language)
                          : formatCurrency(row.wage, language)
                      }`}
                      onClick={() =>
                        setFocusedProvince(isFocused ? "" : row.key)
                      }
                      onKeyDown={(event) =>
                        activateWithKeyboard(event, () =>
                          setFocusedProvince(isFocused ? "" : row.key),
                        )
                      }
                    >
                      <td className="province-cell">
                        <span
                          className={`cell-dot ${row.colorClass}`}
                          aria-hidden="true"
                        />
                        {row.label}
                      </td>
                      <td className="value-cell">
                        {metric === "growth"
                          ? formatPercent(row.chartValue, language)
                          : formatCurrency(row.wage, language)}
                      </td>
                      <td>#{index + 1}</td>
                      <td
                        className={
                          vsAverage > 0
                            ? "positive"
                            : vsAverage < 0
                              ? "negative"
                              : ""
                        }
                      >
                        {vsAverage > 0 ? "↑" : vsAverage < 0 ? "↓" : "—"}
                        {vsAverage !== 0
                          ? metric === "growth"
                            ? formatPercent(Math.abs(vsAverage), language)
                            : formatCurrency(Math.abs(vsAverage), language)
                          : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {/* Live region for screen readers */}
      <p className="sr-only" aria-live="polite">
        {copy.dashboardUpdated}: {selectedYear}, {selectedProvinces.length}{" "}
        {copy.selectedCount}, {metric === "growth" ? copy.growth : copy.wage}.
      </p>
    </main>
  );
}