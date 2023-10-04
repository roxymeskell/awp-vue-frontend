import { ChartTypeRegistry } from 'chart.js';

declare module 'chart.js' {
    interface ChartTypeRegistry {
        'happiness-bar': ChartTypeRegistry['bar'],
        // bar: {
        //     chartOptions: BarControllerChartOptions;
        //     datasetOptions: BarControllerDatasetOptions;
        //     defaultDataPoint: number | [number, number] | null;
        //     metaExtensions: {};
        //     parsedDataType: BarParsedData,
        //     scales: keyof CartesianScaleTypeRegistry;
        //   };
    }
}