import "./polyfills.js";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import FallbackView from "../../react/src/widgets/Aggregator/components/FallbackView";
import styleInject from "../../react/src/utils/styleInject";
import { BanditContextProvider } from "../../react/src/context/BanditContext";

const BanditWidget = React.lazy(() =>
  import("../../react/src/index").then((module) => ({
    default: module.BanditWidget,
  }))
);

const emptyFunction = function () {};

window.renderFeatured = emptyFunction;
window.renderSubscribe = emptyFunction;
window.renderMenu = emptyFunction;

window.renderStats = function (props) {
  // const { id, accessKey: accessKeyProps } = props
  const ele = document.getElementById("bad-stats");
  if (!ele) return;
  const accessKey = ele.dataset.accessKey;
  if (!accessKey) return;

  styleInject(
    '@font-face{font-display:swap;font-family:DM Sans;font-style:normal;font-weight:400;src:url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff2) format("woff2"),url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-normal.woff) format("woff")}@font-face{font-display:swap;font-family:DM Sans;font-style:italic;font-weight:400;src:url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-italic.woff2) format("woff2"),url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-400-italic.woff) format("woff")}@font-face{font-display:swap;font-family:DM Sans;font-style:normal;font-weight:500;src:url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff2) format("woff2"),url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-normal.woff) format("woff")}@font-face{font-display:swap;font-family:DM Sans;font-style:italic;font-weight:500;src:url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-italic.woff2) format("woff2"),url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-500-italic.woff) format("woff")}@font-face{font-display:swap;font-family:DM Sans;font-style:normal;font-weight:700;src:url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff2) format("woff2"),url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-normal.woff) format("woff")}@font-face{font-display:swap;font-family:DM Sans;font-style:italic;font-weight:700;src:url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-italic.woff2) format("woff2"),url(https://cdn.jsdelivr.net/npm/@fontsource/dm-sans/files/dm-sans-latin-700-italic.woff) format("woff")}'
  );
  const root = ReactDOM.createRoot(ele);
  root.render(
    <React.StrictMode>
      <Suspense fallback={<FallbackView />}>
        <BanditContextProvider
          settings={{
            accessKey,
            sandbox: import.meta.env.DEV,
          }}
        >
          <BanditWidget accessKey={accessKey} {...props} />
        </BanditContextProvider>
      </Suspense>
    </React.StrictMode>
  );
};

if (import.meta.env.DEV) {
  window.renderStats();
}
