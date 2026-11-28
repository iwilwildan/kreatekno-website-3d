import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChatCircleDots,
  CheckCircle,
  ClipboardText,
  Clock,
  Gauge,
  Package,
  ShoppingCart,
  Table,
  WarningCircle,
} from "@phosphor-icons/react/ssr";
import type { CSSProperties } from "react";
import type { StokPanggung } from "@/content/solusi/cerita/schema";

export function PanggungStok({
  copy,
  metrics,
  scene,
}: {
  copy: StokPanggung;
  metrics: { value: string; unit: string; label: string }[];
  scene: number;
}) {
  const { sku, item, clerk, buyer, labels, stock } = copy;
  const gauge = {
    "--sm-stock": `${(stock.remaining / stock.opening) * 100}%`,
    "--sm-minimum": `${(stock.minimum / stock.opening) * 100}%`,
  } as CSSProperties;
  const product = (
    <div className="sm-product">
      <Package weight="duotone" /> <b>{item}</b>
      <code>{sku}</code>
    </div>
  );

  return (
    <div className="sm-cv" data-scene={scene}>
      <div className="sm-panel sm-before">
        <div className="sm-head">
          <ClipboardText weight="duotone" /> <b>{labels.before}</b>
          <span>{clerk}</span>
        </div>
        {product}
        <dl className="sm-facts">
          <div>
            <dt>{labels.recorded}</dt>
            <dd>
              {stock.opening} {labels.unit}
            </dd>
          </div>
          <div>
            <dt>{labels.outbound}</dt>
            <dd>
              {stock.outbound} {labels.unit}
            </dd>
          </div>
        </dl>
      </div>
      <div className="sm-panel sm-movement">
        <div className="sm-head">
          <ClipboardText weight="duotone" /> <b>{labels.movement}</b>
          <span>{clerk}</span>
        </div>
        {product}
        <div className="sm-transaction is-out">
          <ArrowDown weight="bold" />
          <span>{labels.outbound}</span>
          <b>
            −{stock.outbound} {labels.unit}
          </b>
        </div>
      </div>
      <div className="sm-panel sm-table">
        <div className="sm-head">
          <Table weight="duotone" /> <b>{labels.inventory}</b>
        </div>
        {product}
        <div className="sm-stock-change">
          <span>{stock.opening}</span>
          <ArrowRight weight="bold" />
          <b>{stock.remaining}</b>
          <small>{labels.unit}</small>
        </div>
      </div>
      <div className="sm-panel sm-threshold">
        <div className="sm-head">
          <Gauge weight="duotone" /> <b>{labels.threshold}</b>
        </div>
        <dl className="sm-gauge-values">
          <div>
            <dt>{labels.remaining}</dt>
            <dd>
              {stock.remaining} {labels.unit}
            </dd>
          </div>
          <div>
            <dt>{labels.minimum}</dt>
            <dd>
              {stock.minimum} {labels.unit}
            </dd>
          </div>
        </dl>
        <div className="sm-gauge" style={gauge}>
          <i />
          <span />
        </div>
        <span className="sm-status is-low">
          <WarningCircle weight="fill" /> {labels.below}
        </span>
        <div className="sm-estimate">
          <div>
            <b>{labels.estimate}</b>
            <span className="sm-status">{labels.design}</span>
          </div>
          <p>{labels.estimateBasis}</p>
          <small>{labels.estimateCondition}</small>
        </div>
      </div>
      <div className="sm-panel sm-alert">
        <div className="sm-head">
          <ChatCircleDots weight="duotone" /> <b>{labels.chat}</b>
          <span>{buyer}</span>
        </div>
        <div className="sm-message">
          <div className="sm-message-title">
            <WarningCircle weight="fill" /> <b>{labels.alert}</b>
          </div>
          <strong>{item}</strong>
          <dl className="sm-facts">
            <div>
              <dt>{labels.remaining}</dt>
              <dd>
                {stock.remaining} {labels.unit}
              </dd>
            </div>
            <div>
              <dt>{labels.minimum}</dt>
              <dd>
                {stock.minimum} {labels.unit}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="sm-panel sm-order">
        <div className="sm-head">
          <ShoppingCart weight="duotone" /> <b>{labels.order}</b>
          <span>{buyer}</span>
        </div>
        {product}
        <div className="sm-pending-order">
          <b>
            {stock.ordered} {labels.unit}
          </b>
          <span className="sm-status">
            <Clock weight="bold" /> {labels.waiting}
          </span>
        </div>
        <dl className="sm-facts">
          <div>
            <dt>{labels.remaining}</dt>
            <dd>
              {stock.remaining} {labels.unit}
            </dd>
          </div>
        </dl>
      </div>
      <div className="sm-panel sm-receipt">
        <div className="sm-head">
          <Table weight="duotone" /> <b>{labels.inventory}</b>
          <span>{clerk}</span>
        </div>
        {product}
        <div className="sm-transaction is-in">
          <CheckCircle weight="fill" />
          <span>{labels.received}</span>
          <b>
            +{stock.ordered} {labels.unit}
          </b>
        </div>
        <div className="sm-stock-change">
          <span>{stock.remaining}</span>
          <ArrowUp weight="bold" />
          <b>{stock.closing}</b>
          <small>{labels.unit}</small>
        </div>
      </div>
      <div className="og-mx">
        {metrics.map(({ value, unit, label }) => (
          <div className="og-m" key={label}>
            <b>
              {value}
              <small>{unit}</small>
            </b>
            <p>{label}</p>
          </div>
        ))}
        <span className="og-sample">{labels.sample}</span>
      </div>
    </div>
  );
}
