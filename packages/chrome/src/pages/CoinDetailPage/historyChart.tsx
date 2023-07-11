import { Extendable } from '../../types';
import React, { useEffect, useRef, useState } from 'react';
import { Axis, Chart, Line, Geom, Tooltip, LineAdvance } from 'bizcharts';
import classNames from 'classnames';
import { formateRelativetime } from '../../utils/formatDatetime';
import { set } from 'superstruct';
type HistoryChartProps = Extendable & {
  data: any;
  coinType: string | undefined;
  symbol: string;
  timePeriod: string;
  usdPrice: string;
  // 24h before price
};

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export default function HistoryChart(props: HistoryChartProps) {
  const data = props.data?.coins[0]?.history
    ?.map(
      (item: any) =>
        item.timestamp && {
          timestamp: item.timestamp,
          date:
            props.timePeriod === 'day'
              ? new Date(item.timestamp).toLocaleDateString()
              : new Date(item.timestamp).toLocaleTimeString(),
          price: Number(item.price),
        }
    )
    ?.sort((a: any, b: any) => a.timestamp - b.timestamp);

  const currentPrice = props.usdPrice;
  const currentTimestamp = Date.now();

  const pricePercentChange24h = props.data?.coins[0]?.pricePercentChange24h;
  const [selectedPrice, setSelectedPrice] = useState(
    data && data[data.length - 1].price
  );
  const [selectedTimestamp, setSelectedTimestamp] = useState(
    data && data[data.length - 1].timestamp
  );
  const [priceChangePercent, setPriceChangePercent] = useState(
    Number(pricePercentChange24h)
  );

  function handleChangeCursorEvent(e: any) {
    if (e.type === 'tooltip:change') {
      setSelectedPrice(e.data?.items[0].value);
      setSelectedTimestamp(e.data?.items[0]?.data?.timestamp);
      setPriceChangePercent(
        (e.data?.items[0].value - currentPrice) / currentPrice
      );
    }
  }

  function handleMouseLeave(e: any) {
    setSelectedPrice(currentPrice);
    setPriceChangePercent(Number(pricePercentChange24h));
    setSelectedTimestamp(currentTimestamp);
  }
  // if (!data) {
  //   return null;
  // }

  return (
    <div className="h-[200px]">
      <div className="w-full flex justify-center">
        <div className="flex gap-2">
          <p className="mx-auto text-large">{formatPrice(selectedPrice)}</p>
          <div>
            <div
              className={classNames([
                'rounded-lg',
                Number(priceChangePercent) > 0 && [
                  'text-green-500',
                  'bg-green-100',
                ],
                Number(priceChangePercent) === 0 && [
                  'text-gray-500',
                  'bg-gray-100',
                ],
                Number(priceChangePercent) < 0 && [
                  'text-red-500',
                  'bg-red-100',
                ],
              ])}
              style={{
                fontFamily: 'Inter',
                fontWeight: 450,
                fontSize: '12px',
                padding: '2px 5px',
              }}
            >
              {Number(priceChangePercent) > 0 && '+'}
              {Number(priceChangePercent) === 0 && ''}
              {Number(priceChangePercent).toFixed(2)}%
            </div>
          </div>
          <p>
            {currentTimestamp - selectedTimestamp < 60 * 1000
              ? 'Today'
              : formateRelativetime(selectedTimestamp)}
          </p>
        </div>
      </div>
      <Chart
        padding={[10, -10, 10, -10]}
        // padding="auto"
        autoFit
        height={160}
        data={data}
        animate={false}
        // onAfterrender={handleChangeCursorEvent}
        onTooltipChange={handleChangeCursorEvent}
        onMouseleave={handleMouseLeave}
      >
        <Axis name="price" visible={false}></Axis>
        <Axis name="date" visible={false}></Axis>
        <Tooltip
          showCrosshairs={false}
          showMarkers
          marker={{
            style: {},
            lineWidth: 3,
            r: 6,
          }}

          // type="mini"
          // showTitle={false}
          // crosshairs={{
          //   type: 'rect',
          // }}
        >
          {(title, items) => {
            // console.log(title, items);
            // // items 是个数组，即被触发tooltip的数据。
            // // 获取items的颜色
            // const color = items[0].color;
            return <></>;
          }}
        </Tooltip>
        {/* <Geom
          // type='area'
          tooltip={[
            'date*price',
            (date, price) => {
              return {
                // 自定义 tooltip 上显示的 title 显示内容等。
                name: date,
                title: new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(price),
                value: new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(price),
              };
            },
          ]}
        /> */}
        <LineAdvance
          shape="smooth"
          area
          position="date*price"
          legend={{
            visible: false,
          }}
          // label={}
          xAxis={false}
          yAxis={false}

          // label={false}
          // color="blue"
        />
      </Chart>
    </div>
  );
}
