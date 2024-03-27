export default function externalTooltip(context: any, options?: any) {
  // Tooltip Element
  const tooltipEl = document.getElementById('chartjs-tooltip');

  // Create element on first render
  if (!tooltipEl) {
    const newTooltipEl = document.createElement('div');
    newTooltipEl.id = 'chartjs-tooltip';
    newTooltipEl.innerHTML = `
      <table style="position: relative; background: rgb(13, 12, 44); font-size: 12px; color: rgb(255, 255, 255); border-radius: 6px; padding: 8px 8px 8px 16px;"></table>
    `;
    document.body.appendChild(newTooltipEl);
    return tooltipEl;
  }

  // Hide if no tooltip
  const { opacity } = context.tooltip;
  if (opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (context.tooltip.yAlign) {
    tooltipEl.classList.add(context.tooltip.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  const getBody = (bodyItem: any) => bodyItem.lines[0];

  // Set Text
  if (context.tooltip.body) {
    const titleLines = context.tooltip.title || [];
    const bodyLines = context.tooltip.body.map(getBody);

    const borderLeft = `<div style="position: absolute;width: 4px;height: 66%;left: 8px;top: 10px;background: #fff;border-radius: 20px;text-align: left;"></div>`;
    let innerHtml = borderLeft + '<thead>';

    if (titleLines.length) {
      titleLines.forEach((title: string) => {
        innerHtml += `<tr><th><span style="color: #a7a7a9;font-weight: normal;">Product: </span><span>${title}</span></th></tr>`;
      });
    }
    innerHtml += '</thead><tbody>';

    bodyLines.forEach((body: string) => {
      if (!titleLines.length) {
        const label = body.split(': ')[0];
        innerHtml += `<tr><th><span style="color: #a7a7a9;font-weight: normal;">Product: </span><span>${label}</span></th></tr>`;
      }
      const value = body.split(': ')[1];
      innerHtml += `<tr><td><span style="color: #a7a7a9;">Values: </span><span style="font-weight: 600;">${value}</span></td></tr>`;
    });
    innerHtml += '</tbody>';

    const tableRoot = tooltipEl.querySelector('table');
    tableRoot!.innerHTML = innerHtml;
  }

  const position = context.chart.canvas.getBoundingClientRect();

  tooltipEl.style.opacity = '1';
  tooltipEl.style.position = 'absolute';
  tooltipEl.style.left = `${position.left + window.pageXOffset + context.tooltip.caretX}px`;
  tooltipEl.style.top = `${position.top + window.pageYOffset + context.tooltip.caretY}px`;
  tooltipEl.style.padding = `${context.tooltip.padding}px`;
  tooltipEl.style.pointerEvents = 'none';
}
