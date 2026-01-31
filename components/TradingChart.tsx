'use client';

import React, { useEffect, useRef } from 'react';

export const TradingChart = () => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "height": "750",
            "symbol": "BINANCE:BTCUSDT",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        });

        container.current.innerHTML = '';
        container.current.appendChild(script);
    }, []);

    return (
        <div
            className="tradingview-widget-container w-full h-[500px] sm:h-[600px] lg:h-[750px]"
            ref={container}
            style={{ minHeight: '500px' }}
        >
            <div className="tradingview-widget-container__widget h-full w-full"></div>
        </div>
    );
};
