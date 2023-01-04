import React, { useEffect, useState, useRef, useContext } from "react";
import ReactECharts from 'echarts-for-react';
import { GlobalContext } from '../../context/GlobalState';
import _ from 'lodash';

export default function LineChart({ series,name,nameGap,max }) {
    const { labels } = useContext(GlobalContext)
    const echartRef = useRef();
    const [width, setWidth] = useState(window.innerWidth);
    const [chart_series, setSeries] = useState(series)
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;
    const mobileFormatter = value => {
        let val = '';
        if (value >= 1000000) {
            val = value / 1000000 + 'm';
        } else if (value >= 1000) {
            val = value / 1000 + 'k';
        } else {
            val = value;
        }


        return val;
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const downloadChart = () => {
        const echartInstance = echartRef.current.getEchartsInstance();
        echartInstance.setOption({
            graphic: [
                {
                    type: 'image',
                    left: 'center',
                    top: '0%',
                    style: {
                        image: '/adh-logo.svg',
                        width: 150,
                        opacity: 0.3
                    }
                }
            ]
        })
        var a = document.createElement("a");
        a.href = echartInstance.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        a.download = true
        a.click();
    }
    useEffect(() => {

        if (isMobile) {
            if (echartRef != null && echartRef != undefined) {
                const echartInstance = echartRef.current.getEchartsInstance();
                echartInstance.resize();
            }
        }
    }, [isMobile])

    useEffect(() => {
        const echartInstance = echartRef.current.getEchartsInstance();
        echartInstance.resize()
    }, [series])


    return (
        <ReactECharts
            ref={echartRef}
            lazyUpdate={true}
            notMerge={true}
            option={{
                grid: {
                    left: '6%',
                    right: '10%',
                    bottom: '7%',
                    //containLabel: true
                  },
                  legend: { icon: 'rect' },
                yAxis: [
                    {

                        type: 'value',
                        name: name,
                        nameLocation: 'middle',
                        nameGap: isMobile? 35: nameGap,
                        // min: min,
                        // max: max,
                        nameTextStyle: {
                            fontWeight: '500',
                            fontFamily: 'Open Sans',
                            fontSize: 12,
                            color: '#000000'
                        },
                        axisLabel: {
                            formatter: mobileFormatter,
                            fontWeight: '500',
                            fontFamily: 'Open Sans',
                            fontSize: 12,
                            color: '#000000'
                        }
                    },
                ],
                xAxis: {
                    type: 'category',
                    nameTextStyle: {
                        fontWeight: '500',
                        fontFamily: 'Open Sans',
                        fontSize: 12,
                        color: '#000000',
                    },
                    axisLabel: {
                        formatter: (function (value) {
                            //value = value.split('T')[0];
                            value = new Date(value)
                            value = value.getDay() + 1 + " " + monthNames[value.getMonth()] + ", " + value.getFullYear()
                            return value;
                        }),
                        fontWeight: '500',
                        fontFamily: 'Open Sans',
                        fontSize: 12,
                        color: '#000000'
                    },
                   // min: min,
                    data: labels,
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        let date = params[0].axisValue.split('00:00:00 GM')[0]
                        let label = '<strong>' + date + '</strong><hr/>';
                        _.forEach(params, function (param) {
                            //let value = (parseFloat(param.value)* 100).toFixed(0);
                            let value = parseFloat(param.value)
                            label += '<strong style="color: ' + param.color + '; text-transform: capitalize;">' + param.seriesName.replaceAll('_', ' ') + '</strong>: ' + value + '<br/>'
                        })

                        return label
                    }
                },
                series: series
            }}
            style={{ height: '360px' }}
        />
    );
}