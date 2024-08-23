import PropTypes from "prop-types";
import React, {
  Children,
  Component,
  createContext
  // isValidElement
  // createElement
} from "react";
// import { isContextConsumer, isValidElementType } from "react-is";
import invariant from "tiny-invariant";
import KeepAlive, {Conditional} from "./KeepAlive.js";

import {matchPath} from "./matchPath";
import {__RouterContext as RouterContext} from "./Router";

var createNamedContext = function createNamedContext(name) {
  var context = createContext();
  context.displayName = name;
  return context;
};

const MatchContext = createNamedContext("Router-Match");

// const isValidElement = (object) => {
//   // return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
//   return typeof object === "object" && object !== null && object.$$typeof;
// };

export async function getPromiseState(p) {
  return await Promise.race([
    Promise.resolve(p).then(
      () => "fulfilled",
      () => "rejected"
    ),
    Promise.resolve().then(() => "pending")
  ]);
}

const isValidElementType = (type) => {
  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var hasSymbol = typeof Symbol === "function" && Symbol.for;
  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 0xeac7;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 0xeaca;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol
    ? Symbol.for("react.strict_mode")
    : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 0xeace; // TODO: We don't use AsyncMode or ConcurrentMode anymore. They were temporary
  // (unstable) APIs that have been removed. Can we remove the symbols?
  var REACT_ASYNC_MODE_TYPE = hasSymbol
    ? Symbol.for("react.async_mode")
    : 0xeacf;
  var REACT_CONCURRENT_MODE_TYPE = hasSymbol
    ? Symbol.for("react.concurrent_mode")
    : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol
    ? Symbol.for("react.forward_ref")
    : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 0xead1;
  var REACT_SUSPENSE_LIST_TYPE = hasSymbol
    ? Symbol.for("react.suspense_list")
    : 0xead8;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 0xead4;
  var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 0xead9;
  var REACT_FUNDAMENTAL_TYPE = hasSymbol
    ? Symbol.for("react.fundamental")
    : 0xead5;
  var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 0xead6;
  var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 0xead7;

  return (
    // typeof type === "string" ||
    // typeof type === "function" ||
    // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE ||
    type === REACT_CONCURRENT_MODE_TYPE ||
    type === REACT_PROFILER_TYPE ||
    type === REACT_STRICT_MODE_TYPE ||
    type === REACT_SUSPENSE_TYPE ||
    type === REACT_SUSPENSE_LIST_TYPE ||
    (typeof type === "object" &&
      type !== null &&
      (type.$$typeof === REACT_FRAGMENT_TYPE ||
        type.$$typeof === REACT_CONCURRENT_MODE_TYPE ||
        type.$$typeof === REACT_PROFILER_TYPE ||
        type.$$typeof === REACT_STRICT_MODE_TYPE ||
        type.$$typeof === REACT_SUSPENSE_TYPE ||
        type.$$typeof === REACT_SUSPENSE_LIST_TYPE ||
        type.$$typeof === REACT_ELEMENT_TYPE ||
        type.$$typeof === REACT_ASYNC_MODE_TYPE ||
        type.$$typeof === REACT_PORTAL_TYPE ||
        type.$$typeof === REACT_LAZY_TYPE ||
        type.$$typeof === REACT_MEMO_TYPE ||
        type.$$typeof === REACT_PROVIDER_TYPE ||
        type.$$typeof === REACT_CONTEXT_TYPE ||
        type.$$typeof === REACT_FORWARD_REF_TYPE ||
        type.$$typeof === REACT_FUNDAMENTAL_TYPE ||
        type.$$typeof === REACT_RESPONDER_TYPE ||
        type.$$typeof === REACT_SCOPE_TYPE ||
        type.$$typeof === REACT_BLOCK_TYPE))
  );
};

const NullComponent = () => {
  return <div> </div>;
};
class SwitchKeepAlive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      AsynComponent: NullComponent,
      locationKey: "",
      match: null,
      isSync: true,
      components: []
    };
  }
  componentDidMount() {
    const {AsynComponent, locationKey, match, components} = this.state;
    let {children} = this.props;
    let {history = {}, location = {}, routesComponent = []} = this.context;

    let {key, pathname} = location;
    const index = components.findIndex((item) => {
      return item.pathname === pathname;
    });

    let {loading: Loading} = this.context;
    if (Loading) {
      this.setState({
        AsynComponent: Loading
      });
    }
    if (index === -1) {
      this.setState({
        components: [
          ...components,
          {
            pathname,
            component: Loading || NullComponent,
            type: "loading"
          }
        ]
      });
    }
  }

  getSyncComponent = (component, callback = () => {}) => {
    if (
      Object.prototype.toString.call(component).slice(1, -1) === "object Module"
    ) {
      component = component.default;
    } else if (
      Object.prototype.toString.call(component).slice(1, -1) === "object Object"
    ) {
      if (isValidElementType(component)) {
        return component;
      } else if (component.__esModule) {
        component = this.getSyncComponent(component.default, callback);
      }
    }
    //  else if (
    //   Object.prototype.toString.call(component).slice(1, -1) ===
    //   "object Function"
    // ) {
    //   component = component(this.props);
    //   component = this.getSyncComponent(component, callback);
    // }
    else if (
      Object.prototype.toString.call(component).slice(1, -1) ===
      "object Promise"
    ) {
      this.resolveComponent(component, callback).then((AsynComponent) => {
        callback(AsynComponent);
      });
      return null;
    }
    return component;
  };

  resolveComponent = async (component, callback = () => {}) => {
    if (
      Object.prototype.toString.call(component).slice(1, -1) ===
      "object Function"
    ) {
      component = component(this.props);
      component = this.resolveComponent(component, callback);
    } else if (
      Object.prototype.toString.call(component).slice(1, -1) === "object Module"
    ) {
      component = component.default;
    } else if (
      Object.prototype.toString.call(component).slice(1, -1) ===
      "object Promise"
    ) {
      /* eslint-disable   */
      // component = await new Promise(async (relove, reject) => {
      //   setTimeout(async () => {
      //     let data = await component;
      //     relove(data);
      //   }, 2000);
      // });
      /* eslint-enable   */

      // let status = await getPromiseState(component);

      component = await component;

      component = await this.resolveComponent(component, callback);
    } else {
      component = this.getSyncComponent(component, callback);
    }

    return component;
  };

  loadComponents = () => {
    const {AsynComponent, locationKey, match, components} = this.state;
    let {children} = this.props;
    let {
      history = {},
      location = {},
      routesComponent = [],
      Loading
    } = this.context;

    let {key, pathname} = location;
    if (!Object.keys(this.context).length) {
      throw new Error(
        invariant(
          false,
          "You should not use <SwitchKeepAlive/> outside a <Router>"
        )
      );
    }
    const index = components.findIndex((item) => {
      return item.pathname === pathname;
    });
    const Component = index >= 0 ? components[index].component : null;
    if (Component) {
      return components;
    }

    var newMatch = null;
    let SyncComponent = null;

    Children.forEach(children, (el) => {
      if (newMatch === null) {
        let {
          path: pathProp,
          exact,
          strict,
          sensitive,
          from,
          component,
          element,
          render
        } = el.props;
        let path = pathProp || from;
        component = component || element || render;

        newMatch = matchPath(location.pathname, {
          path: path,
          exact: exact,
          strict: strict,
          sensitive: sensitive
        });

        if (newMatch) {
          SyncComponent = this.getSyncComponent(component, (AsynComponent) => {
            const index = components.findIndex((item) => {
              return item.pathname === pathname;
            });

            if (index >= 0) {
              components[index].component = AsynComponent;
            } else {
              components.push({
                pathname,
                component: AsynComponent
              });
            }

            this.setState({
              isSync: false,
              AsynComponent, // 异步
              match: newMatch,
              locationKey: key,
              components: [...components]
            });
          });

          if (SyncComponent) {
            components.push({
              pathname,
              component: SyncComponent
            });
            this.setState({
              isSync: true,
              AsynComponent: SyncComponent, // 同步
              match: newMatch,
              locationKey: key,
              components: [...components]
            });
          }
        }
      }
    });

    return components;
  };
  getComponents = () => {
    const {AsynComponent, locationKey, match} = this.state;

    let {children} = this.props;
    let {history = {}, location = {}, routesComponent = []} = this.context;
    let {key, pathname} = location;

    if (!Object.keys(this.context).length) {
      throw new Error(
        invariant(
          false,
          "You should not use <SwitchKeepAlive/> outside a <Router>"
        )
      );
    }

    const components = this.loadComponents();
    return components.map((item, index) => {
      const {component: Component, type} = item;
      return type === "loading" ? (
        <MatchContext.Provider
          key={key}
          value={{
            history,
            location,
            match
          }}>
          <Component
            match={match}
            history={history}
            location={location}
            exact={match?.isExact}
            routesComponent={routesComponent}
          />
        </MatchContext.Provider>
      ) : (
        <MatchContext.Provider
          key={item.pathname}
          value={{
            history,
            location,
            match
          }}>
          {" "}
          <Conditional _key={item.pathname} active={item.pathname === pathname}>
            <Component
              match={match}
              history={history}
              location={location}
              exact={match?.isExact}
              routesComponent={routesComponent}
            />
          </Conditional>
        </MatchContext.Provider>
      );
    });
  };

  render() {
    const {children} = this.props;

    return this.getComponents();
  }
}

SwitchKeepAlive.contextType = RouterContext;
SwitchKeepAlive.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

// 缓存路由
export {isValidElementType, MatchContext, SwitchKeepAlive};
