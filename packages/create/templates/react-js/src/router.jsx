import { createHashRouter } from "react-router-dom";

const routeModule = import.meta.glob("./pages/**/*.tsx", {
  eager: true,
  import: "default",
});
const modules = Object.entries(routeModule);
const pathRegExp = /\.\/pages(.*).tsx/;
const defaultRoutes = modules.map((v) => {
  const [path, Element] = v;
  const pathLike = path.replace(pathRegExp, "$1");
  let routePath = /\/index/.test(pathLike)
    ? pathLike.replace(/\/index/, "")
    : pathLike;
  if (/\[\w+\]/.test(pathLike)) {
    const slug = pathLike.replace(/.*\[(\w+)\]/, "$1");
    routePath = pathLike.replace(/\[\w+\]/, `:${slug}`);
  }
  const route = {
    path: routePath,
    element: <Element />,
  };
  return route;
});
export const routes = [...defaultRoutes];
const router = createHashRouter(routes);

export default router;
