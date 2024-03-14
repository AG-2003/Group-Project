import { onCLS, onFID, onLCP } from 'web-vitals';
import { perf } from '../firebase-config';
import { trace } from 'firebase/performance';

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        onCLS(metric => {
            onPerfEntry(metric);
            const clsTrace = trace(perf, 'CLS');
            clsTrace.start();
            clsTrace.incrementMetric('cumulative_layout_shift', Math.round(metric.value));
            // clsTrace.stop();
        });
        onFID(metric => {
            onPerfEntry(metric);
            const fidTrace = trace(perf, 'FID');
            fidTrace.start();
            fidTrace.incrementMetric('first_input_delay', Math.round(metric.value));
            // fidTrace.stop();
        });
        onLCP(metric => {
            onPerfEntry(metric);
            const lcpTrace = trace(perf, 'LCP');
            lcpTrace.start();
            lcpTrace.incrementMetric('largest_contentful_paint', Math.round(metric.value));
            // lcpTrace.stop();
        });
    }
};